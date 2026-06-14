import Link from "next/link";

const mentorCapabilities = [
  "Mentoría IA para técnica vocal",
  "Calificaciones después de audiciones",
  "Rutinas de práctica para participantes",
  "Retroalimentación premium para suscriptores",
];

export default function AiMentor() {
  return (
    <section id="ia" className="et-showcase-section relative px-4 py-16 text-white md:py-20">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#FFD700]">
            Mentoría ET
          </p>
          <h2 className="text-4xl font-black uppercase leading-none text-white drop-shadow-[0_0_24px_rgba(255,215,0,0.22)] md:text-6xl">
            Codex IA mentor vocal
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-white/72">
            Mentoría de voz, preparación para concursos y calificaciones guiadas
            para suscriptores ET.
          </p>
        </div>

        <div className="rounded-2xl border border-[#FFD700]/25 bg-black/50 p-6 shadow-[0_0_28px_rgba(255,215,0,0.12),inset_0_1px_0_rgba(255,255,255,0.14)]">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-yellow-300">
            Premium
          </p>
          <h3 className="text-2xl font-black uppercase text-white">
            Voz, práctica y calificación
          </h3>
          <p className="mt-4 text-sm font-medium leading-7 text-white/70">
            Disponible para miembros con suscripción cuando activemos las compras
            dentro de la app.
          </p>

          <ul className="mt-6 grid gap-3">
            {mentorCapabilities.map((capability) => (
              <li
                className="rounded-lg border border-white/[0.16] bg-white/[0.045] p-4 text-sm font-black uppercase tracking-[0.12em] text-white/75"
                key={capability}
              >
                {capability}
              </li>
            ))}
          </ul>

          <Link className="gold-button mt-6 w-full" href="/camerino">
            Abrir mi camerino
          </Link>
        </div>
      </div>
    </section>
  );
}
