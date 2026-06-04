export default function StarProject() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="glass-card">
          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            🌟 Proyecto Estrella
          </h2>

          <p className="mx-auto mb-8 max-w-3xl text-lg text-white/70">
            Los mejores talentos de cada categoría podrán colaborar en proyectos reales:
            canciones, producciones, portadas y lanzamientos oficiales.
          </p>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="mini-card">🏆 Mejor Voz</div>
            <div className="mini-card">🏆 Mejor Beat</div>
            <div className="mini-card">🏆 Mejor Instrumentista</div>
            <div className="mini-card">🏆 Mejor Diseñador</div>
          </div>

          <p className="mt-8 text-2xl font-bold text-yellow-300">
            = Producción Oficial ET
          </p>
        </div>
      </div>
    </section>
  );
}