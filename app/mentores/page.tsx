"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AiMentor from "@/components/AiMentor";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserConfig,
} from "@/lib/supabase/client";

const mentorNeeds = [
  {
    icon: "🎤",
    title: "Canto",
    need: "Coaches vocales, técnica, respiración, interpretación y presencia escénica.",
  },
  {
    icon: "🎙️",
    title: "Rap & Freestyle",
    need: "Mentores de lírica, flow, improvisación, batalla y construcción de identidad.",
  },
  {
    icon: "🎧",
    title: "Beats & Producción",
    need: "Productores, mezcla, arreglos, estructura musical y dirección sonora.",
  },
  {
    icon: "🎸",
    title: "Instrumentistas",
    need: "Músicos con experiencia en ejecución, lectura, ensamble y performance.",
  },
  {
    icon: "💃",
    title: "Danza",
    need: "Coreógrafos, bailarines, directores de movimiento y preparación escénica.",
  },
  {
    icon: "🎭",
    title: "Teatro & Actuación",
    need: "Actores, directores, coaches de cámara, voz, improvisación y escena.",
  },
  {
    icon: "📸",
    title: "Fotografía & Video",
    need: "Mentores de narrativa visual, edición, dirección, iluminación y portafolio.",
  },
  {
    icon: "🎨",
    title: "Arte Visual",
    need: "Ilustradores, artistas digitales, plásticos, muralistas y directores creativos.",
  },
];

export default function MentoresPage() {
  const supabase = useMemo(
    () => (hasSupabaseBrowserConfig() ? createSupabaseBrowserClient() : null),
    [],
  );
  const [hasSession, setHasSession] = useState(false);
  const [isReady, setIsReady] = useState(() => !hasSupabaseBrowserConfig());

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isActive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isActive) {
        setHasSession(Boolean(data.session));
        setIsReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session));
      setIsReady(true);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!isReady) {
    return (
      <main className="page-shell">
        <section className="et-showcase-section px-4 py-16 text-white">
          <div className="mx-auto max-w-3xl rounded-[24px] border border-white/[0.16] bg-white/[0.035] p-6 text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Cargando mentoría ET
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main className="page-shell">
        <section className="et-showcase-section px-4 py-16 text-white md:py-24">
          <div className="mx-auto max-w-3xl rounded-[24px] border border-white/[0.16] bg-white/[0.035] p-6 text-center shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Mentores ET
            </p>
            <h1 className="mt-4 bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
              Área para miembros
            </h1>
            <p className="mt-5 text-lg font-bold leading-8 text-cyan-300">
              Entra o crea tu cuenta para ver mentoría IA, calificaciones y
              beneficios para suscriptores.
            </p>
            <Link className="gold-button mt-7 w-full md:w-auto" href="/registro?next=mentores">
              Entrar o registrarme
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <AiMentor />

      <section className="et-showcase-section relative px-4 pb-16 text-white md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Red de mentores
            </p>
            <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
              Mentores por categoría
            </h1>
            <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
              Por ahora usamos IA Mentor como apoyo inicial. La red humana de
              mentores ET viene pronto, y estamos formando el equipo por categoría.
            </p>
          </div>

          <div className="mb-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.22)]">
              Codex IA será mentor de voz, evaluación y calificaciones para suscriptores ET.
            </p>
          </div>

          <section className="mb-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
                  Mentor IA Premium
                </p>
                <h2 className="mt-3 bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-3xl font-black uppercase leading-none text-transparent md:text-5xl">
                  Codex IA para voz y calificaciones
                </h2>
                <p className="mt-4 text-sm font-bold leading-7 text-cyan-300">
                  Análisis de voz, recomendaciones de práctica, preparación para
                  concursos y retroalimentación de calificación. Disponible para
                  suscriptores mediante compras dentro de la app.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/12 bg-black/26 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Estado
                </p>
                <p className="mt-2 text-2xl font-black uppercase text-white">
                  Suscripción requerida
                </p>
                <button className="gold-button mt-5 w-full text-sm" disabled>
                  In-app purchases próximamente
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mentorNeeds.map((mentor) => (
              <article
                key={mentor.title}
                className="group rounded-[28px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_0_24px_rgba(34,211,238,0.16),0_0_30px_rgba(250,204,21,0.12),inset_0_1px_0_rgba(255,255,255,0.18)]"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent_46%),linear-gradient(90deg,rgba(34,211,238,0.72),rgba(236,72,153,0.66),rgba(250,204,21,0.72))] text-3xl shadow-[0_0_18px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.26)]">
                  {mentor.icon}
                </div>
                <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-xl font-black uppercase leading-tight text-transparent">
                  {mentor.title}
                </h2>
                <p className="mt-3 text-sm font-medium leading-6 text-cyan-300 drop-shadow-[0_0_7px_rgba(34,211,238,0.16)]">
                  {mentor.need}
                </p>
                <a
                  href="#aplicar-mentor"
                  className="mt-5 inline-flex rounded-full border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent_46%),linear-gradient(90deg,#22d3ee,#ec4899,#facc15)] px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_24px_rgba(34,211,238,0.24),0_0_28px_rgba(250,204,21,0.2),inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:scale-105"
                >
                  Aplicar como mentor
                </a>
              </article>
            ))}
          </div>

          <section
            id="aplicar-mentor"
            className="mt-12 scroll-mt-28 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8"
          >
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
                Únete al equipo
              </p>
              <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-3xl font-black uppercase leading-none text-transparent md:text-5xl">
                Formulario para mentores
              </h2>
              <p className="mt-5 text-sm font-medium leading-7 text-cyan-300">
                Déjanos tus datos para evaluar tu perfil cuando abramos la red
                oficial de mentores ET.
              </p>
            </div>

            <form
              action="mailto:hola@encuentrodetalentos.com"
              method="post"
              encType="text/plain"
              className="mt-8 grid gap-4 md:grid-cols-2"
            >
              <input className="input" name="nombre" placeholder="Nombre completo" />
              <input className="input" name="correo" placeholder="Correo electrónico" />
              <input className="input" name="pais" placeholder="País / ciudad" />
              <select className="input" name="categoria" defaultValue="">
                <option value="" disabled>
                  Categoría de mentoría
                </option>
                {mentorNeeds.map((mentor) => (
                  <option key={mentor.title}>{mentor.title}</option>
                ))}
              </select>
              <input className="input md:col-span-2" name="experiencia" placeholder="Experiencia, portafolio o red social" />
              <textarea
                className="input min-h-36 resize-y md:col-span-2"
                name="mensaje"
                placeholder="Cuéntanos cómo puedes apoyar a los talentos ET"
              />
              <button type="submit" className="gold-button md:col-span-2">
                Enviar aplicación
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
