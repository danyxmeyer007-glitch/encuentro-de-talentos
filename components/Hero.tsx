
// ==========================================
// HERO SECTION
// ==========================================

import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero-section"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 text-white"
    >
      {/* Background Glow */}
      <div className="hero-background" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* ==========================================
            HERO CONTENT
        ========================================== */}
        <div id="hero-content" className="hero-content relative z-10">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Diviértete • Participa • Gana premios
          </p>

          <h1 className="text-5xl font-black uppercase leading-none md:text-7xl lg:text-8xl">
            <span className="block bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-transparent">
              Encuentro
            </span>

            <span className="block text-yellow-400">
              de
            </span>

            <span className="block bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-transparent">
              Talentos
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.16)]">
            Participa en concursos, desarrolla tus habilidades, recibe mentoría y
            muestra tu talento al mundo en una experiencia mágica, interactiva y llena
            de oportunidades.
          </p>

          <Link href="/participar" className="gold-button mt-10">
            Participar Ahora
          </Link>
        </div>
        {/* ==========================================
            ORBIT MENU
        ========================================== */}
        <div
          id="hero-orbit-container"
          className="relative z-10 flex items-center justify-center"
        >
          <div className="orbit-carousel">

            <div className="orbit-glow" />

            <div className="orbit-ring orbit-ring-1" />
            <div className="orbit-ring orbit-ring-2" />

            {/* Orbit Items */}
            <div className="orbit-item orbit-item-1 orbit-contests">
              <Link href="/concursos" className="orbit-link">
                Concursos
              </Link>
            </div>

            <div className="orbit-item orbit-item-2 orbit-categories">
              <Link href="/categorias" className="orbit-link">
                Categorías
              </Link>
            </div>

            <div className="orbit-item orbit-item-3 orbit-mentors">
              <Link href="/mentores" className="orbit-link">
                Mentores
              </Link>
            </div>

            <div className="orbit-item orbit-item-4 orbit-participate">
              <Link href="/participar" className="orbit-link">
                Participar
              </Link>
            </div>

            <div className="orbit-item orbit-item-5 orbit-about">
              <Link href="/about" className="orbit-link">
                Acerca
              </Link>
            </div>

            {/* Center Logo */}
            <div id="hero-logo" className="orbit-center">
              <span className="orbit-logo-mark" aria-label="Encuentro de Talentos">
                ET
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
