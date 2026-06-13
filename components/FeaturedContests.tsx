"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

const singingContestSlug = "voz-piloto-2026";
const minVoiceParticipants = 1;
const maxVoiceParticipants = 10;

const contests = [
  {
    title: "Temporada Piloto: Voz",
    status: "Inicia el 15 de julio",
    icon: "🎤",
    participants: "Próximamente",
    category: "Canto",
    description: "Para voces solistas, dúos e intérpretes listos para debutar frente a la comunidad. El concurso empieza el 15 de julio.",
  },
  {
    title: "Batalla de Beats",
    status: "Próximamente",
    icon: "🎧",
    participants: "Próximamente",
    category: "Producción Musical",
    description: "Productores, beatmakers y creadores de instrumentales originales.",
  },
  {
    title: "Instrumentistas ET",
    status: "Próximamente",
    icon: "🎸",
    participants: "Próximamente",
    category: "Instrumentistas",
    description: "Guitarra, piano, saxofón, batería, cuerdas, viento y más talento en vivo.",
  },
];

const phases = [
  {
    title: "Convocatoria",
    description: "Periodo de inscripción para registrar talento y preparar participación.",
  },
  {
    title: "Debut",
    description: "Presentación pública del talento ante comunidad, IA y expertos.",
  },
  {
    title: "Evaluación",
    description: "Revisión combinada con comunidad, IA y criterio experto.",
  },
  {
    title: "Resultados",
    description: "Anuncio oficial de ganadores y cierre de la fase.",
  },
];

const evaluation = [
  { label: "Comunidad", value: "40%" },
  { label: "IA", value: "40%" },
  { label: "Expertos", value: "20%" },
];

const disqualifications = [
  "Plagio",
  "Fraude",
  "Bots",
  "Compra de votos",
  "Suplantación",
];

type FeaturedContestsProps = {
  fullPage?: boolean;
};

export default function FeaturedContests({ fullPage = false }: FeaturedContestsProps) {
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [userId, setUserId] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [participantProfiles, setParticipantProfiles] = useState<
    Array<{
      user_id: string;
      name: string | null;
      username: string;
      photo_url: string | null;
    }>
  >([]);
  const [performers, setPerformers] = useState<
    Array<{ user_id: string; stage_name: string | null; genre: string | null }>
  >([]);
  const [status, setStatus] = useState("");
  const [participantsRefreshKey, setParticipantsRefreshKey] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    async function loadParticipants() {
      const { data: sessionData } = await client.auth.getSession();
      setUserId(sessionData.session?.user.id ?? "");

      const registrations = await client
        .from("contest_registrations")
        .select("user_id")
        .eq("contest_slug", singingContestSlug)
        .order("created_at", { ascending: true })
        .limit(maxVoiceParticipants);

      if (registrations.error) {
        setStatus(registrations.error.message);
        return;
      }

      const ids = (registrations.data ?? [])
        .map((item) => item.user_id)
        .slice(0, maxVoiceParticipants);
      setParticipantIds(ids);

      if (!ids.length) {
        setParticipantProfiles([]);
        setPerformers([]);
        return;
      }

      const [profilesResponse, performersResponse] = await Promise.all([
        client
          .from("profiles")
          .select("user_id, name, username, photo_url")
          .in("user_id", ids),
        client
          .from("performer_profiles")
          .select("user_id, stage_name, genre")
          .in("user_id", ids),
      ]);

      setParticipantProfiles(profilesResponse.data ?? []);
      setPerformers(performersResponse.data ?? []);
    }

    void loadParticipants();
  }, [participantsRefreshKey, supabase]);

  async function registerForSinging() {
    if (!supabase) {
      setStatus("Configura Supabase para registrar participantes.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    const currentUserId = session?.user.id;

    if (!currentUserId) {
      setStatus("Inicia sesión y crea tu perfil para participar en canto.");
      return;
    }

    if (
      participantIds.length >= maxVoiceParticipants &&
      !participantIds.includes(currentUserId)
    ) {
      setStatus("La lista fija de canto ya tiene 10 participantes.");
      return;
    }

    const response = await fetch("/api/contest-registrations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contestSlug: singingContestSlug }),
    });

    const result = (await response.json()) as {
      error?: string;
      participantIds?: string[];
    };

    if (!response.ok) {
      setStatus(result.error ?? "No se pudo registrar tu perfil en canto.");
      return;
    }

    setUserId(currentUserId);
    setParticipantIds(result.participantIds ?? participantIds);
    setParticipantsRefreshKey((current) => current + 1);
    setStatus("Tu perfil artístico fue agregado a participantes de canto.");
  }

  const performerByUser = new Map(
    performers.map((performer) => [performer.user_id, performer]),
  );

  return (
    <section id="concursos" className="et-showcase-section relative px-4 py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-x-8 top-10 h-56 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Concursos 2026
          </p>
          <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            Concursos Oficiales
          </h1>
          <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
            Descubrimos y promovemos nuevos talentos con temporadas diseñadas
            para participar, debutar, recibir evaluación y competir con reglas claras.
          </p>
        </div>

        <div className="mb-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.22)]">
            Objetivo oficial: descubrir y promover nuevos talentos.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {contests.map((contest, index) => (
            <article
              key={contest.title}
              className="group rounded-[28px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_0_24px_rgba(34,211,238,0.16),0_0_30px_rgba(250,204,21,0.12),inset_0_1px_0_rgba(255,255,255,0.18)]"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent_46%),linear-gradient(90deg,rgba(34,211,238,0.72),rgba(236,72,153,0.66),rgba(250,204,21,0.72))] text-3xl shadow-[0_0_18px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.26)]">
                {contest.icon}
              </div>

              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                {contest.category}
              </p>
              <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-2xl font-black uppercase leading-tight text-transparent">
                {contest.title}
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-cyan-300 drop-shadow-[0_0_7px_rgba(34,211,238,0.16)]">
                {contest.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/[0.035] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
                  {contest.status}
                </span>
                <span className="rounded-full border border-white/20 bg-white/[0.035] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
                  Participantes: {index === 0 ? `${participantIds.length}/${maxVoiceParticipants}` : contest.participants}
                </span>
                {index === 0 ? (
                  <span className="rounded-full border border-white/20 bg-white/[0.035] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
                    Mínimo live: {minVoiceParticipants}
                  </span>
                ) : null}
              </div>
              {index === 0 ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    className="gold-button-small"
                    type="button"
                    disabled={
                      participantIds.length >= maxVoiceParticipants &&
                      !participantIds.includes(userId)
                    }
                    onClick={registerForSinging}
                  >
                    {userId && participantIds.includes(userId)
                      ? "Ya participas"
                      : participantIds.length >= maxVoiceParticipants
                        ? "Lista llena"
                        : "Registrar en canto"}
                  </button>
                  <Link className="secondary-button px-4 py-2 text-sm" href="/camerino">
                    Ver camerino
                  </Link>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        {status ? (
          <p className="mt-5 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100">
            {status}
          </p>
        ) : null}

        {fullPage ? (
          <section className="mt-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)]">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
              Participantes de canto
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {participantProfiles.length ? (
                participantProfiles.map((profile) => {
                  const performer = performerByUser.get(profile.user_id);
                  const displayName =
                    performer?.stage_name || profile.name || `@${profile.username}`;

                  return (
                    <article
                      className="rounded-2xl border border-white/12 bg-black/24 p-4"
                      key={profile.user_id}
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-300/10 place-items-center font-black text-cyan-100">
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
                            displayName.slice(0, 1)
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-black">{displayName}</h3>
                          <p className="truncate text-sm font-bold text-cyan-200">
                            {performer?.genre || "Canto"}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="rounded-2xl border border-white/12 bg-black/24 p-4 text-sm font-bold text-white/58 md:col-span-2 lg:col-span-3">
                  Aun no hay participantes inscritos en canto.
                </p>
              )}
            </div>
          </section>
        ) : null}

        {fullPage ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <section className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)]">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Reglamento Oficial
              </p>
              <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-3xl font-black uppercase leading-none text-transparent">
                Fases del concurso
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {phases.map((phase, index) => (
                  <article
                    key={phase.title}
                    className="rounded-2xl border border-white/12 bg-white/[0.025] p-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                      Fase {index + 1}
                    </p>
                    <h3 className="mt-2 text-lg font-black uppercase text-cyan-300">
                      {phase.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-cyan-300">
                      {phase.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)]">
                <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                  Evaluación
                </p>
                <div className="grid gap-3">
                  {evaluation.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.025] px-4 py-3"
                    >
                      <span className="text-sm font-black uppercase tracking-[0.14em] text-cyan-300">
                        {item.label}
                      </span>
                      <span className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-2xl font-black text-transparent">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)]">
                <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                  Descalificaciones
                </p>
                <div className="flex flex-wrap gap-2">
                  {disqualifications.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full border border-white/20 bg-white/[0.035] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-300"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-medium leading-6 text-cyan-300">
                  Las decisiones finales serán definitivas.
                </p>
              </section>
            </aside>
          </div>
        ) : null}
      </div>
    </section>
  );
}
