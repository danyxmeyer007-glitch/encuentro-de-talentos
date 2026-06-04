const steps = [
  { number: "01", title: "Participa", text: "Regístrate y sube tu talento." },
  { number: "02", title: "Debuta", text: "Tu participación se presenta ante la comunidad." },
  { number: "03", title: "Recibe evaluación", text: "Comunidad, IA y expertos califican tu trabajo." },
  { number: "04", title: "Destaca", text: "Gana reconocimiento y oportunidades." },
];

export default function HowItWorks() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="section-title">¿Cómo funciona?</h2>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="glass-card">
              <span className="mb-4 block text-4xl font-black text-yellow-300/40">
                {step.number}
              </span>
              <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
              <p className="text-white/70">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}