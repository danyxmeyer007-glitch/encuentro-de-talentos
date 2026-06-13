const steps = [
  { number: "01", title: "Convocatoria", text: "Registra tu perfil, categoría y datos de contacto para la temporada piloto." },
  { number: "02", title: "Debut", text: "Presenta tu talento ante la comunidad cuando se active tu fase." },
  { number: "03", title: "Evaluación", text: "Comunidad, IA y expertos revisan creatividad, técnica, originalidad y presencia." },
  { number: "04", title: "Resultados", text: "Destaca, recibe reconocimiento y abre nuevas oportunidades dentro de ET." },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="et-showcase-section relative px-4 py-16 text-white md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Proceso ET
          </p>
          <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            ¿Cómo funciona?
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
            Participar es sencillo: registras tu talento, debutas, recibes evaluación
            y puedes destacar en las primeras temporadas oficiales.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-[28px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)]"
            >
              <span className="mb-5 block bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-5xl font-black text-transparent">
                {step.number}
              </span>
              <h3 className="text-xl font-black uppercase text-cyan-300">{step.title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-cyan-300">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
