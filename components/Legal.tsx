const legalDocs = [
  {
    title: "Términos de Servicio",
    href: "/legal/terminos-de-servicio.pdf",
    summary: "Aceptación, uso de la plataforma, propiedad intelectual, licencia, conducta, premios y contacto.",
  },
  {
    title: "Reglamento Oficial de Concursos",
    href: "/legal/reglamento-oficial-de-concursos.pdf",
    summary: "Objetivo, categorías iniciales, fases, sistema de evaluación, descalificaciones y resultados.",
  },
];

const terms = [
  "Los usuarios aceptan los términos al registrarse o usar Encuentro de Talentos.",
  "La plataforma permite concursos creativos, evaluación de talento y colaboración artística.",
  "Los participantes conservan la propiedad de sus obras y contenidos.",
  "El contenido publicado puede usarse para operar, mostrar y promocionar la plataforma.",
  "Queda prohibido publicar material robado, infringir derechos o manipular resultados.",
];

export default function Legal() {
  return (
    <section className="relative px-4 py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-x-8 top-10 h-56 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Legal ET
          </p>
          <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            Documentos Legales
          </h1>
          <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
            Consulta los documentos oficiales de Encuentro de Talentos. Esta sección
            mantiene disponibles los archivos legales enviados para la plataforma.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {legalDocs.map((doc) => (
            <article
              key={doc.title}
              className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)]"
            >
              <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-2xl font-black uppercase text-transparent">
                {doc.title}
              </h2>
              <p className="mt-4 text-sm font-medium leading-6 text-cyan-300">
                {doc.summary}
              </p>
              <a
                href={doc.href}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent_46%),linear-gradient(90deg,#22d3ee,#ec4899,#facc15)] px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_24px_rgba(34,211,238,0.24),0_0_28px_rgba(250,204,21,0.2),inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:scale-105"
              >
                Ver PDF
              </a>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Resumen de términos
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {terms.map((term) => (
              <p
                key={term}
                className="rounded-2xl border border-white/12 bg-white/[0.025] p-4 text-sm font-medium leading-6 text-cyan-300"
              >
                {term}
              </p>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
