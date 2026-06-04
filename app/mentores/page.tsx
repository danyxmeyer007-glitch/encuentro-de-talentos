export default function MentoresPage() {
  return (
    <main className="page-shell">
      <section className="content-section">
        <h1 className="page-title">Mentores</h1>
        <p className="page-subtitle">
          Buscamos profesores de canto, productores, músicos y creativos que quieran ayudar a formar nuevos talentos.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card">
            <h2 className="mb-3 text-2xl font-bold text-yellow-300">
              🎤 Profesores de canto
            </h2>
            <p className="text-white/70">
              Evalúa voces, da retroalimentación y conecta con futuros alumnos.
            </p>
          </div>

          <div className="glass-card">
            <h2 className="mb-3 text-2xl font-bold text-yellow-300">
              🎵 Productores
            </h2>
            <p className="text-white/70">
              Ayuda a mejorar beats, mezclas y propuestas musicales.
            </p>
          </div>

          <div className="glass-card">
            <h2 className="mb-3 text-2xl font-bold text-yellow-300">
              🎸 Instrumentistas
            </h2>
            <p className="text-white/70">
              Comparte tu experiencia y guía a nuevos músicos.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}