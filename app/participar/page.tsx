export default function ParticiparPage() {
  return (
    <main className="page-shell">
      <section className="content-section">
        <h1 className="page-title">Participa</h1>
        <p className="page-subtitle">
          Únete a la lista de espera para la temporada piloto.
        </p>

        <form className="glass-card mx-auto max-w-2xl space-y-4">
          <input className="input" placeholder="Nombre artístico" />
          <input className="input" placeholder="Correo electrónico" />
          <input className="input" placeholder="País" />

          <select className="input" defaultValue="">
            <option value="" disabled>
              Selecciona tu categoría
            </option>
            <option>Canto</option>
            <option>Beats / Producción Musical</option>
            <option>Instrumentista</option>
            <option>Quiero ser mentor</option>
          </select>

          <button className="gold-button w-full" type="submit">
            🚀 Enviar Registro
          </button>
        </form>
      </section>
    </main>
  );
}