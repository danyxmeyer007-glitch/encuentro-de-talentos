export default function StarProject() {
  return (
    <section className="relative px-4 py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-x-8 top-10 h-56 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Salón de la Fama 2026
          </p>
          <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            Proyecto Estrella
          </h1>
          <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
            Los talentos más destacados de cada categoría podrán entrar al Salón de
            la Fama ET y colaborar en proyectos reales: canciones, producciones,
            portadas, lanzamientos y piezas oficiales.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["🏆", "Mejor Voz", "Interpretación, técnica y emoción."],
              ["🎧", "Mejor Beat", "Producción, identidad sonora y originalidad."],
              ["🎸", "Mejor Instrumentista", "Ejecución, presencia y musicalidad."],
              ["🎨", "Mejor Visual", "Diseño, arte, imagen y concepto."],
            ].map(([icon, title, text]) => (
              <article
                key={title}
                className="rounded-[28px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)]"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent_46%),linear-gradient(90deg,rgba(34,211,238,0.72),rgba(236,72,153,0.66),rgba(250,204,21,0.72))] text-3xl shadow-[0_0_18px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.26)]">
                  {icon}
                </div>
                <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-xl font-black uppercase leading-tight text-transparent">
                  {title}
                </h2>
                <p className="mt-3 text-sm font-medium leading-6 text-cyan-300">
                  {text}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-[28px] border border-white/[0.16] bg-white/[0.035] p-5 text-center text-sm font-black uppercase tracking-[0.2em] text-cyan-300 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)]">
            Selección destacada = Producción Oficial ET
          </p>
        </div>
      </div>
    </section>
  );
}
