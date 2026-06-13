import Image from "next/image";
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
      <div className="pointer-events-none absolute inset-x-8 top-12 h-44 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.16),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto max-w-7xl rounded-2xl border border-[#FFD700]/25 bg-black/50 p-6 shadow-[0_0_34px_rgba(255,215,0,0.13),inset_0_1px_0_rgba(255,255,255,0.14)] md:p-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="relative flex h-14 w-14 overflow-hidden rounded-2xl border border-[#FFD700]/45 bg-black shadow-[0_0_28px_rgba(255,215,0,0.3)] transition group-hover:scale-105">
                <Image
                  src="/et-simple.png"
                  alt="Encuentro de Talentos"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>

              <span className="leading-tight">
                <span className="block text-sm font-black uppercase tracking-[0.2em] text-white">
                  Encuentro
                </span>
                <span className="block text-sm font-black uppercase tracking-[0.25em] text-[#FFD700]">
                  de Talentos
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-base font-medium leading-7 text-white/72">
              No buscamos a los más famosos. Buscamos a los más talentosos:
              personas listas para participar, aprender, competir y abrirse camino
              con apoyo real.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:hola@encuentrodetalentos.com"
                className="et-primary-button inline-flex items-center justify-center px-5 py-2 text-sm"
              >
                Contáctanos
              </a>

              <a
                href="#faqs"
                className="rounded-full border border-white/20 bg-white/[0.045] px-5 py-2 text-sm font-black uppercase tracking-widest text-white transition hover:border-[#FFD700]/45 hover:text-[#FFD700]"
              >
                FAQs
              </a>

              <Link
                href="/legal"
                className="rounded-full border border-white/20 bg-white/[0.045] px-5 py-2 text-sm font-black uppercase tracking-widest text-white transition hover:border-[#FFD700]/45 hover:text-[#FFD700]"
              >
                Legal
              </Link>
            </div>
          </div>

          <section id="faqs" className="scroll-mt-28 lg:pt-2">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#FFD700]">
              FAQs
            </h2>
            <div className="mt-5 space-y-4">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-lg border border-white/12 bg-white/[0.045] p-4"
                >
                  <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#FFD700]">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-white/70">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Encuentro de Talentos. Todos los derechos reservados.</p>
            <p>Sitio activo y actualizado para 2026.</p>
          </div>

          <p className="mt-3 max-w-4xl text-xs font-medium leading-6 text-white/48">
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
