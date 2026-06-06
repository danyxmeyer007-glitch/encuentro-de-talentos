const contests = [
  {
    title: "Temporada Piloto: Voz",
    status: "Convocatoria abierta",
    icon: "🎤",
    participants: "Próximamente",
    category: "Canto",
    description: "Para voces solistas, dúos e intérpretes listos para debutar frente a la comunidad.",
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
  return (
    <section id="concursos" className="relative px-4 py-16 text-white md:py-24">
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
          {contests.map((contest) => (
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
                  Participantes: {contest.participants}
                </span>
              </div>
            </article>
          ))}
        </div>

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
