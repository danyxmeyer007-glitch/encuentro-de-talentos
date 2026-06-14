"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

type Follow = {
  following_id: string;
};

type StandaloneNavigator = Navigator & {
  standalone?: boolean;
};

const contestSlug = "voz-piloto-2026";
const maxVoiceParticipants = 10;
const sections = [
  { href: "#trending-talents", label: "Talentos" },
  { href: "#new-participants", label: "Audición" },
  { href: "#escenario-preview", label: "Concurso" },
  { href: "#upcoming-auditions", label: "App live" },
];
const submitOptions = ["Canto", "Danza", "Actuación", "Instrumento", "Talento libre"];

function isStandaloneApp() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.userAgent.includes("EncuentroTalentosAndroid") ||
    (window.navigator as StandaloneNavigator).standalone === true
  );
}

function getDisplayName(profile: Profile, performer?: Performer) {
  return performer?.stage_name || profile.name || `@${profile.username}`;
}

function getSubline(profile: Profile, performer?: Performer) {
  return performer?.genre || profile.talent_type || "Talento ET";
}

export default function Home() {
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [isApp, setIsApp] = useState(false);
  const [status, setStatus] = useState(
    hasSupabaseBrowserConfig()
      ? "Cargando datos reales de talentos"
      : "Esperando conexión con Supabase para mostrar talentos reales",
  );

  useEffect(() => {
    function syncDisplayMode() {
      setIsApp(isStandaloneApp());
    }

    const standaloneQuery = window.matchMedia("(display-mode: standalone)");

    syncDisplayMode();
    standaloneQuery.addEventListener("change", syncDisplayMode);

    return () => {
      standaloneQuery.removeEventListener("change", syncDisplayMode);
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isActive = true;
    const client = supabase;

    async function loadHomeData() {
      const [profilesResponse, registrationsResponse] = await Promise.all([
        client
          .from("profiles")
          .select("user_id, name, username, photo_url, country, city, bio, talent_type")
          .order("created_at", { ascending: false })
          .limit(8),
        client
          .from("contest_registrations")
          .select("user_id, contest_slug")
          .eq("contest_slug", contestSlug)
          .order("created_at", { ascending: true })
          .limit(maxVoiceParticipants),
      ]);

      if (!isActive) {
        return;
      }

      if (profilesResponse.error) {
        setStatus(profilesResponse.error.message);
        return;
      }

      if (registrationsResponse.error) {
        setStatus(registrationsResponse.error.message);
        return;
      }

      const visibleProfiles = (profilesResponse.data ?? []) as Profile[];
      const visibleUserIds = visibleProfiles.map((profile) => profile.user_id);
      const performerResponse = visibleUserIds.length
        ? await client
            .from("performer_profiles")
            .select("user_id, stage_name, genre")
            .in("user_id", visibleUserIds)
        : { data: [], error: null };
      const followsResponse = visibleUserIds.length
        ? await client
            .from("follows")
            .select("following_id")
            .in("following_id", visibleUserIds)
        : { data: [], error: null };

      if (!isActive) {
        return;
      }

      if (performerResponse.error) {
        setStatus(performerResponse.error.message);
        return;
      }

      setProfiles(visibleProfiles);
      setPerformers((performerResponse.data ?? []) as Performer[]);
      setRegistrations((registrationsResponse.data ?? []) as Registration[]);
      setFollows((followsResponse.data ?? []) as Follow[]);
      setStatus(
        visibleProfiles.length
          ? "Datos reales de talentos cargados"
          : "Esperando el primer perfil de la comunidad",
      );
    }

    void loadHomeData();

    return () => {
      isActive = false;
    };
  }, [supabase]);

  const performerByUser = new Map(
    performers.map((performer) => [performer.user_id, performer]),
  );
  const contestUsers = new Set(registrations.map((item) => item.user_id));
  const contestProfiles = profiles.filter((profile) =>
    contestUsers.has(profile.user_id),
  );
  const featuredProfiles = contestProfiles.length ? contestProfiles : profiles;
  const followerCounts = follows.reduce<Record<string, number>>((counts, follow) => {
    counts[follow.following_id] = (counts[follow.following_id] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <main className="talent-app">
      <section className="featured-banner" aria-labelledby="home-title">
        <div className="banner-copy">
          <p className="eyebrow">Tu talento. Tu momento. Tu historia.</p>
          <h1 id="home-title">Encuentro de Talentos</h1>
          <p className="banner-text">
            Diviértete, participa y compite por el primer lugar de $100 USD.
            Crea tu camerino, sube tu audición y descubre la experiencia live
            dentro de la app.
          </p>
          <div className="banner-actions">
            <Link href="/concursos" className="primary-action">
              Participar por $100
            </Link>
            <Link href="#upcoming-auditions" className="secondary-action">
              Ver app live
            </Link>
          </div>
        </div>

        <div className="phone-stage" aria-label="Vista previa de la app">
          <div className="phone-frame">
            <video
              src="/videos/ETportada1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="phone-video"
            />
          </div>
          <div className="prize-card">
            <span>Premio</span>
            <strong>$100</strong>
            <small>USD para primer lugar</small>
          </div>
        </div>
      </section>

      <section className="quick-sections" aria-label="Secciones">
        {sections.map((section) => (
          <Link href={section.href} key={section.href}>
            {section.label}
          </Link>
        ))}
      </section>

      <section className="content-grid">
        <div className="main-feed">
          <section id="trending-talents" className="panel">
            <div className="section-heading">
              <p>Perfiles del camerino</p>
              <h2>Talentos reales de la comunidad</h2>
            </div>

            {featuredProfiles.length ? (
              <div className="talent-row">
                {featuredProfiles.map((profile) => {
                  const performer = performerByUser.get(profile.user_id);
                  const displayName = getDisplayName(profile, performer);

                  return (
                    <article className="talent-card" key={profile.user_id}>
                      <div
                        className="cover-gradient real-talent-cover"
                        style={
                          profile.photo_url
                            ? { backgroundImage: `url(${profile.photo_url})` }
                            : undefined
                        }
                      >
                        <div className="play-button" aria-hidden="true" />
                        <span>{getSubline(profile, performer)}</span>
                      </div>
                      <div className="talent-info">
                        <div
                          className="avatar"
                          aria-hidden="true"
                          style={
                            profile.photo_url
                              ? { backgroundImage: `url(${profile.photo_url})` }
                              : undefined
                          }
                        >
                          {profile.photo_url ? "" : displayName.slice(0, 1)}
                        </div>
                        <div>
                          <h3>{displayName}</h3>
                          <p>
                            {followerCounts[profile.user_id] ?? 0} fans
                          </p>
                        </div>
                        <strong>{contestUsers.has(profile.user_id) ? "En escenario" : "Nuevo"}</strong>
                      </div>
                      <dl className="talent-meta">
                        <div>
                          <dt>Categoría</dt>
                          <dd>{profile.talent_type || "Sin categoría todavía"}</dd>
                        </div>
                        <div>
                          <dt>Ubicación</dt>
                          <dd>
                            {[profile.city, profile.country].filter(Boolean).join(", ") ||
                              "No compartida todavía"}
                          </dd>
                        </div>
                        <div>
                          <dt>Camerino</dt>
                          <dd>{profile.bio ? "Perfil listo" : "Falta bio"}</dd>
                        </div>
                      </dl>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="Esperando al primer talento"
                text="Crea tu camerino y tu perfil podrá convertirse en la primera tarjeta real de esta sección."
                actionHref="/registro"
                actionLabel="Unirme ahora"
              />
            )}
          </section>

          <section id="escenario-preview" className="panel scenario-panel">
            <div className="section-heading">
              <p>Escenario de competencia</p>
              <h2>{isApp ? "Escenario en vivo" : "El escenario abre dentro de la app"}</h2>
            </div>
            <div className="scenario-card">
              <div className="scenario-cover">
                <Image
                  src="/et-portada.png"
                  alt="Portada del concurso Encuentro de Talentos"
                  fill
                  sizes="(max-width: 900px) 90vw, 380px"
                  className="object-cover"
                />
              </div>
              <div className="scenario-copy">
                <p className="eyebrow">Voz Piloto 2026</p>
                <h3>Concursos, jurado, premio y reglas</h3>
                <p>
                  La primera temporada empieza con una meta sencilla: descubrir una
                  voz real, llevarla al escenario live y premiar al primer lugar
                  con $100 USD.
                </p>
                <div className="rule-grid">
                  <span>Fila: {registrations.length}/{maxVoiceParticipants}</span>
                  <span>Voces: {registrations.length}/{maxVoiceParticipants}</span>
                  <span>Camerino: obligatorio</span>
                  <span>Live: dentro del APK</span>
                </div>
              </div>
            </div>
          </section>

          <section id="featured-mentors" className="panel">
            <div className="section-heading">
              <p>Red de mentores</p>
              <h2>Mentores, jurados e invitados especiales llegan pronto</h2>
            </div>
            <EmptyState
              title="Aún no hay mentores oficiales publicados"
              text="Aquí aparecerán perfiles reales, videos de consejos, sesiones en vivo y disponibilidad de retroalimentación cuando el equipo esté aprobado."
              actionHref="/mentores"
              actionLabel="Aplicar o ver avances"
            />
          </section>
        </div>

        <aside className="side-rail" aria-label="Subir talento y rankings">
          <section id="new-participants" className="submit-panel">
            <p className="eyebrow">Subir talento</p>
            <h2>Flujo de audición</h2>
            <div className="submit-options">
              {submitOptions.map((option) => (
                <button type="button" key={option}>
                  {option}
                </button>
              ))}
            </div>
            <ol>
              <li>Graba tu video</li>
              <li>Sube tu muestra</li>
              <li>Agrega título</li>
              <li>Elige competencia</li>
            </ol>
            <Link href="/concursos" className="center-submit">
              Iniciar audición
            </Link>
          </section>

          <section id="rankings" className="ranking-panel">
            <p className="eyebrow">Salón de la Fama</p>
            <h2>Ranking</h2>
            <div className="rank-tabs" aria-label="Categorías del ranking">
              <span>Top 10</span>
              <span>Regional</span>
              <span>Categoría</span>
            </div>
            <EmptyState
              title="Rankings esperando votos"
              text="Puntajes, vistas y votos aparecerán cuando existan datos reales del concurso en vivo."
              actionHref="/salon-de-la-fama"
              actionLabel="Abrir salón"
            />
          </section>
        </aside>
      </section>

      <section id="upcoming-auditions" className="apk-band">
        <div>
          <p className="eyebrow">APK Android</p>
          <h2>Download para la experiencia en live</h2>
          <span className="sr-only">{status}</span>
        </div>
        <a href="/downloads/encuentro-de-talentos.apk" download>
          Download APK
        </a>
      </section>
    </main>
  );
}

function EmptyState({
  actionHref,
  actionLabel,
  text,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  text: string;
  title: string;
}) {
  return (
    <div className="empty-state-card">
      <span>ET</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <Link href={actionHref}>{actionLabel}</Link>
    </div>
  );
}
