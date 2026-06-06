import Link from "next/link";

const faqs = [
  {
    question: "¿Quién puede participar?",
    answer: "Talentos emergentes con ganas de mostrar su voz, música, creatividad o habilidades.",
  },
  {
    question: "¿Hay concursos activos en 2026?",
    answer: "Sí. La plataforma se mantiene activa en 2026 con convocatorias piloto y nuevas categorías.",
  },
  {
    question: "¿Cómo contacto al equipo?",
    answer: "Usa el botón Contáctanos y cuéntanos si quieres participar, colaborar o recibir información.",
  },
];

export default function Footer() {
  return (
    <footer className="relative px-4 pb-8 pt-16 text-white">
      <div className="pointer-events-none absolute inset-x-8 top-12 h-44 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto max-w-7xl rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-14 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.015] shadow-[0_0_24px_rgba(34,211,238,0.2),0_0_34px_rgba(250,204,21,0.14),inset_0_1px_0_rgba(255,255,255,0.18)] transition group-hover:scale-105">
                <span className="bg-gradient-to-br from-white via-cyan-300 to-yellow-300 bg-clip-text pr-1 text-2xl font-black tracking-[-0.12em] text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.55)]">
                  ET
                </span>
              </span>

              <span className="leading-tight">
                <span className="block bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-sm font-black uppercase tracking-[0.2em] text-transparent">
                  Encuentro
                </span>
                <span className="block bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-sm font-black uppercase tracking-[0.25em] text-transparent">
                  de Talentos
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-base font-medium leading-7 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.14)]">
              No buscamos a los más famosos. Buscamos a los más talentosos:
              personas listas para participar, aprender, competir y abrirse camino
              con apoyo real.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:hola@encuentrodetalentos.com"
                className="rounded-full border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent_46%),linear-gradient(90deg,#22d3ee,#ec4899,#facc15)] px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(34,211,238,0.3),0_0_38px_rgba(250,204,21,0.25),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:scale-105"
              >
                Contáctanos
              </a>

              <a
                href="#faqs"
                className="rounded-full border border-white/20 bg-white/[0.035] px-5 py-2 text-sm font-black uppercase tracking-widest text-cyan-300 transition hover:border-white/35 hover:text-cyan-100 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]"
              >
                FAQs
              </a>

              <Link
                href="/legal"
                className="rounded-full border border-white/20 bg-white/[0.035] px-5 py-2 text-sm font-black uppercase tracking-widest text-cyan-300 transition hover:border-white/35 hover:text-cyan-100 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]"
              >
                Legal
              </Link>
            </div>
          </div>

          <section id="faqs" className="scroll-mt-28 lg:pt-2">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              FAQs
            </h2>
            <div className="mt-5 space-y-4">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-white/12 bg-white/[0.025] p-4"
                >
                  <h3 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-sm font-black uppercase tracking-[0.12em] text-transparent">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-cyan-300">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-3 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300/75 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Encuentro de Talentos. Todos los derechos reservados.</p>
            <p>Sitio activo y actualizado para 2026.</p>
          </div>

          <p className="mt-3 max-w-4xl text-xs font-medium leading-6 text-cyan-300/60">
            El nombre Encuentro de Talentos, el concepto ET, el contenido, diseño,
            textos, gráficos, experiencia visual y materiales de esta plataforma
            pertenecen a sus respectivos titulares y no pueden copiarse, reproducirse,
            distribuirse o usarse comercialmente sin autorización previa por escrito.
          </p>
        </div>
      </div>
    </footer>
  );
}
