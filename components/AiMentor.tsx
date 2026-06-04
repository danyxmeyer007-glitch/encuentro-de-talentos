export default function AiMentor() {
  return (
    <section id="ia" className="section-padding">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
        <div>
          <h2 className="section-title text-left">IA Mentor</h2>
          <p className="mb-6 text-lg text-white/70">
            La inteligencia artificial ayudará a los participantes a recibir retroalimentación clara,
            detectar fortalezas y descubrir áreas de mejora.
          </p>

          <ul className="space-y-3 text-white/80">
            <li>✨ Evaluación técnica</li>
            <li>🎯 Recomendaciones personalizadas</li>
            <li>📈 Seguimiento de progreso</li>
            <li>🏆 Apoyo al sistema de calificación</li>
          </ul>
        </div>

        <div className="glass-card">
          <h3 className="mb-6 text-2xl font-bold text-yellow-300">
            Evaluación Demo
          </h3>

          <div className="space-y-4">
            <Score label="Creatividad" value="92" />
            <Score label="Técnica" value="86" />
            <Score label="Originalidad" value="90" />
            <Score label="Presencia" value="88" />
          </div>

          <p className="mt-6 text-white/70">
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
        <span>{label}</span>
        <span className="text-yellow-300">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-yellow-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}