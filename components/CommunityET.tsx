"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

type Profile = {
  user_id: string;
  name: string | null;
  username: string;
  photo_url: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  talent_type: string | null;
};

type Performer = {
  user_id: string;
  stage_name: string | null;
  genre: string | null;
};

type Registration = {
  user_id: string;
  contest_slug: string;
};

type FriendRequest = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "declined";
};

const contestSlug = "voz-piloto-2026";
const communityProfileLimit = 60;
const contestProfileLimit = 10;
const friendRequestLimit = 500;

export default function CommunityET() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("buscar")?.trim() ?? "";
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [userId, setUserId] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    async function load() {
      const { data: sessionData } = await client.auth.getSession();
      const currentUserId = sessionData.session?.user.id ?? "";
      setUserId(currentUserId);

      const registrationsResponse = await client
        .from("contest_registrations")
        .select("user_id, contest_slug")
        .eq("contest_slug", contestSlug)
        .order("created_at", { ascending: true })
        .limit(contestProfileLimit);

      if (registrationsResponse.error) {
        setStatus(registrationsResponse.error.message);
        return;
      }

      const contestUserIds = (registrationsResponse.data ?? []).map(
        (registration) => registration.user_id,
      );

      const profilesResponse = await client
        .from("profiles")
        .select("user_id, name, username, photo_url, country, city, bio, talent_type")
        .order("created_at", { ascending: false })
        .limit(communityProfileLimit);

      if (profilesResponse.error) {
        setStatus(profilesResponse.error.message);
        return;
      }

      const profileByUser = new Map(
        ((profilesResponse.data ?? []) as Profile[]).map((profile) => [
          profile.user_id,
          profile,
        ]),
      );

      const missingContestUserIds = contestUserIds.filter(
        (contestUserId) => !profileByUser.has(contestUserId),
      );

      if (missingContestUserIds.length) {
        const contestProfilesResponse = await client
          .from("profiles")
          .select("user_id, name, username, photo_url, country, city, bio, talent_type")
          .in("user_id", missingContestUserIds);

        if (contestProfilesResponse.error) {
          setStatus(contestProfilesResponse.error.message);
          return;
        }

        for (const profile of (contestProfilesResponse.data ?? []) as Profile[]) {
          profileByUser.set(profile.user_id, profile);
        }
      }

      const visibleProfiles = Array.from(profileByUser.values());
      const visibleUserIds = visibleProfiles.map((profile) => profile.user_id);
      const performersResponse = visibleUserIds.length
        ? await client
            .from("performer_profiles")
            .select("user_id, stage_name, genre")
            .in("user_id", visibleUserIds)
        : { data: [], error: null };

      if (performersResponse.error) {
        setStatus(performersResponse.error.message);
        return;
      }

      setProfiles(visibleProfiles);
      setPerformers((performersResponse.data ?? []) as Performer[]);
      setRegistrations((registrationsResponse.data ?? []) as Registration[]);

      if (currentUserId) {
        const { data } = await client
          .from("friend_requests")
          .select("id, requester_id, addressee_id, status")
          .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
          .limit(friendRequestLimit);

        setRequests((data ?? []) as FriendRequest[]);
      }
    }

    void load();
  }, [supabase]);

  const performerByUser = new Map(
    performers.map((performer) => [performer.user_id, performer]),
  );
  const contestUsers = new Set(registrations.map((item) => item.user_id));
  const filteredProfiles = searchQuery
    ? profiles.filter((profile) => {
        const performer = performerByUser.get(profile.user_id);
        const searchableText = [
          performer?.stage_name,
          performer?.genre,
          profile.name,
          profile.username,
          profile.city,
          profile.country,
          profile.bio,
          profile.talent_type,
        ]
          .filter(Boolean)
          .join(" ")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        const normalizedQuery = searchQuery
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : profiles;
  const contestProfiles = filteredProfiles.filter((profile) =>
    contestUsers.has(profile.user_id),
  );

  async function addFriend(profile: Profile) {
    if (!supabase || !userId || userId === profile.user_id) return;

    const existing = requests.find(
      (request) =>
        (request.requester_id === userId &&
          request.addressee_id === profile.user_id) ||
        (request.requester_id === profile.user_id &&
          request.addressee_id === userId),
    );

    if (existing) {
      setStatus("Ya existe una solicitud o amistad con este perfil.");
      return;
    }

    const { data, error } = await supabase
      .from("friend_requests")
      .insert({ requester_id: userId, addressee_id: profile.user_id })
      .select("id, requester_id, addressee_id, status")
      .single();

    if (error) {
      setStatus(error.message);
      return;
    }

    setRequests((current) => [...current, data as FriendRequest]);
    setStatus("Solicitud enviada.");
  }

  function getDisplayName(profile: Profile) {
    return (
      performerByUser.get(profile.user_id)?.stage_name ||
      profile.name ||
      `@${profile.username}`
    );
  }

  function getSubline(profile: Profile) {
    return (
      performerByUser.get(profile.user_id)?.genre ||
      profile.talent_type ||
      "Comunidad ET"
    );
  }

  return (
    <section className="et-showcase-section relative px-4 py-12 text-white md:py-16">
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Comunidad ET
          </p>
          <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            Salón de la Fama
          </h1>
          <p className="mt-5 text-lg font-medium leading-8 text-cyan-300">
            {searchQuery
              ? `Resultados para "${searchQuery}" en talentos, perfiles y participantes.`
              : "Perfiles registrados, artistas activos y participantes del Concurso 1: Temporada Piloto Voz."}
          </p>
        </div>

        {status ? (
          <p className="mb-5 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100">
            {status}
          </p>
        ) : null}

        <section className="mb-8 rounded-[28px] border border-white/15 bg-white/[0.035] p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                Concurso 1
              </p>
              <h2 className="mt-1 text-2xl font-black">Participantes de canto</h2>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/55">
              {contestProfiles.length} inscritos
            </span>
          </div>

          <ProfileGrid
            addFriend={addFriend}
            getDisplayName={getDisplayName}
            getSubline={getSubline}
            profiles={contestProfiles}
            userId={userId}
          />
        </section>

        <section className="rounded-[28px] border border-white/15 bg-white/[0.035] p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-300">
                Registrados
              </p>
              <h2 className="mt-1 text-2xl font-black">Comunidad registrada</h2>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/55">
              {filteredProfiles.length} perfiles
            </span>
          </div>

          <ProfileGrid
            addFriend={addFriend}
            getDisplayName={getDisplayName}
            getSubline={getSubline}
            profiles={filteredProfiles}
            userId={userId}
          />
        </section>
      </div>
    </section>
  );
}

function ProfileGrid({
  addFriend,
  getDisplayName,
  getSubline,
  profiles,
  userId,
}: {
  addFriend: (profile: Profile) => void;
  getDisplayName: (profile: Profile) => string;
  getSubline: (profile: Profile) => string;
  profiles: Profile[];
  userId: string;
}) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {profiles.length ? (
        profiles.map((profile) => (
          <article
            className="rounded-[20px] border border-white/12 bg-black/26 p-4"
            key={profile.user_id}
          >
            <div className="flex gap-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-lg font-black text-cyan-100">
                {profile.photo_url ? (
                  <span
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                    style={{
                      backgroundImage: `url(${profile.photo_url})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                ) : (
                  getDisplayName(profile).slice(0, 1)
                )}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black">
                  {getDisplayName(profile)}
                </h3>
                <p className="truncate text-sm font-bold text-cyan-200">
                  {getSubline(profile)}
                </p>
                <p className="mt-1 truncate text-xs font-bold uppercase tracking-[0.12em] text-white/40">
                  {[profile.city, profile.country].filter(Boolean).join(", ") ||
                    "ET"}
                </p>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-white/62">
              {profile.bio || "Perfil de la comunidad Encuentro de Talentos."}
            </p>

            {userId && userId !== profile.user_id ? (
              <button
                className="gold-button-small mt-4"
                type="button"
                onClick={() => addFriend(profile)}
              >
                Agregar amigo
              </button>
            ) : null}
          </article>
        ))
      ) : (
        <div className="rounded-[18px] border border-white/12 bg-black/24 p-5 text-sm font-bold text-white/58 md:col-span-2 xl:col-span-3">
          Todavía no hay perfiles en esta lista.
        </div>
      )}
    </div>
  );
}
