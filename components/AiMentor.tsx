export default function AiMentor() {
  return (
    <section id="ia" className="relative px-4 py-16 text-white md:py-20">
      <div className="pointer-events-none absolute inset-x-8 top-10 h-48 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Mentoría ET
          </p>
          <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            IA Mentor
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
            La inteligencia artificial ayudará a los participantes a recibir retroalimentación clara,
            detectar fortalezas y descubrir áreas de mejora.
          </p>

          <ul className="mt-6 grid gap-3 text-sm font-black uppercase tracking-[0.14em] text-cyan-300 sm:grid-cols-2">
            <li className="rounded-2xl border border-white/[0.16] bg-white/[0.035] p-4">✨ Evaluación técnica</li>
            <li className="rounded-2xl border border-white/[0.16] bg-white/[0.035] p-4">🎯 Recomendaciones</li>
            <li className="rounded-2xl border border-white/[0.16] bg-white/[0.035] p-4">📈 Progreso</li>
            <li className="rounded-2xl border border-white/[0.16] bg-white/[0.035] p-4">🏆 Calificación</li>
          </ul>
        </div>

        <div className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h3 className="mb-6 bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-2xl font-black uppercase text-transparent">
            Evaluación Demo
          </h3>

          <div className="space-y-4">
            <Score label="Creatividad" value="92" />
            <Score label="Técnica" value="86" />
            <Score label="Originalidad" value="90" />
            <Score label="Presencia" value="88" />
          </div>

          <p className="mt-6 text-sm font-medium leading-6 text-cyan-300">
            “Excelente interpretación emocional. Se recomienda trabajar respiración
            y control en notas largas.”
          </p>
        </div>
      </div>
    </section>
  );
}

function Score({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-bold text-cyan-300">{label}</span>
        <span className="font-black text-cyan-300">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
