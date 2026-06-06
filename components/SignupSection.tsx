export default function SignupSection() {
  return (
    <section id="registro" className="relative px-4 py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-x-8 top-10 h-56 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Participa 2026
          </p>
          <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            Sé de los primeros participantes
          </h1>
          <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
            Únete a la lista de espera para la temporada piloto de Encuentro de
            Talentos. Déjanos tus datos y tu categoría para avisarte cuando se
            abra tu convocatoria.
          </p>

          <div className="mt-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
              Convocatoria piloto • cupos limitados • participantes y mentores
            </p>
          </div>
        </div>

        <form className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 text-left shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="input" name="nombre_artistico" placeholder="Nombre artístico" />
            <input className="input" name="correo" placeholder="Correo electrónico" />
            <input className="input" name="pais" placeholder="País / ciudad" />
            <input className="input" name="red_social" placeholder="Red social o portafolio" />
          </div>

          <select className="input mt-4" name="categoria" defaultValue="">
            <option value="" disabled>
              Selecciona tu categoría
            </option>
            <option>Canto</option>
            <option>Rap & Freestyle</option>
            <option>Beats & Producción Musical</option>
            <option>Instrumentistas</option>
            <option>Danza</option>
            <option>Teatro & Actuación</option>
            <option>Fotografía</option>
            <option>Cine & Video</option>
            <option>Arte Digital</option>
            <option>Diseño de Moda</option>
            <option>Escritura & Poesía</option>
            <option>Comedia</option>
            <option>Maquillaje Artístico</option>
            <option>DJ & Mezcla</option>
            <option>Artes Plásticas</option>
            <option>Talento Libre</option>
            <option>Quiero ser mentor</option>
          </select>

          <textarea
            className="input mt-4 min-h-36 resize-y"
            name="descripcion"
            placeholder="Cuéntanos brevemente qué talento quieres presentar"
          />

          <button type="submit" className="gold-button mt-5 w-full">
            Enviar registro
          </button>

          <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
            Registro de interés. La confirmación oficial llegará por correo.
          </p>
        </form>
      </div>
    </section>
  );
}
