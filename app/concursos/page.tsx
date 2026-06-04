const contests = [
  {
    icon: "🎤",
    title: "Temporada Piloto: Voz",
    status: "Convocatoria abierta",
  },
  {
    icon: "🎵",
    title: "Batalla de Beats",
    status: "Próximamente",
  },
  {
    icon: "🎸",
    title: "Instrumentistas ET",
    status: "Próximamente",
  },
];

export default function ConcursosPage() {
  return (
    <main className="page-shell">
      <section className="content-section">
        <h1 className="page-title">Concursos</h1>
        <p className="page-subtitle">
          Participa en las primeras temporadas de Encuentro de Talentos.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {contests.map((contest) => (
            <div key={contest.title} className="glass-card">
              <div className="mb-4 text-5xl">{contest.icon}</div>
              <h2 className="mb-3 text-2xl font-bold">{contest.title}</h2>
              <p className="text-yellow-300">{contest.status}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}