import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-center">
        <div className="glass-panel max-w-5xl text-center">
          <p className="mb-4 text-yellow-300">
            🌌 La nueva plataforma para descubrir talento creativo
          </p>

          <h1 className="mb-6 text-5xl font-black md:text-7xl">
            <span className="gold-text">Encuentro</span>
            <br />
            de Talentos
          </h1>

          <p className="mb-8 text-2xl font-semibold text-white/90">
            Diviértete. Participa. Gana premios.
          </p>

          <p className="mx-auto mb-10 max-w-3xl text-white/70">
            Muestra tu voz, tus beats, tus instrumentos o tu creatividad.
            Recibe evaluación de comunidad, mentores e inteligencia artificial.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/participar" className="gold-button">
              🚀 Quiero Participar
            </Link>

            <Link href="/concursos" className="secondary-button">
              Ver Concursos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}