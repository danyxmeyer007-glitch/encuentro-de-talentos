export default function SignupSection() {
  return (
    <section id="registro" className="section-padding">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="section-title">Sé de los primeros participantes</h2>
        <p className="section-subtitle">
          Únete a la lista de espera para la temporada piloto de Encuentro de Talentos.
        </p>

        <form className="glass-card space-y-4 text-left">
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
            <option>Arte Digital</option>
            <option>Quiero ser mentor</option>
          </select>

          <button type="submit" className="gold-button w-full">
            🚀 Unirme a ET
          </button>
        </form>
      </div>
    </section>
  );
}