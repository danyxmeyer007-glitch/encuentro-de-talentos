const contests = [
  {
    title: "Temporada Piloto: Voz",
    status: "Convocatoria abierta",
    icon: "🎤",
    participants: "Próximamente",
  },
  {
    title: "Batalla de Beats",
    status: "Próximamente",
    icon: "🎵",
    participants: "Próximamente",
  },
  {
    title: "Instrumentistas ET",
    status: "Próximamente",
    icon: "🎸",
    participants: "Próximamente",
  },
];

export default function FeaturedContests() {
  return (
    <section id="concursos" className="section-padding">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="section-title">Concursos</h2>
        <p className="section-subtitle">
          Estamos preparando la primera temporada oficial de Encuentro de Talentos.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {contests.map((contest) => (
            <div key={contest.title} className="glass-card">
              <div className="mb-4 text-5xl">{contest.icon}</div>
              <h3 className="mb-3 text-2xl font-bold">{contest.title}</h3>
              <p className="mb-4 text-yellow-300">{contest.status}</p>
              <p className="text-white/60">Participantes: {contest.participants}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}