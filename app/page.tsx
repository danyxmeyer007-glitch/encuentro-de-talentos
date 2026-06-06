import Link from "next/link";

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-eyebrow">Diviértete • Participa • Gana premios</p>

            <h1 className="hero-title">
              <em>Encuentro</em>
              <span>de</span>
              <strong>Talentos</strong>
            </h1>

            <p className="hero-description">
              Una plataforma para descubrir talentos, participar en concursos,
              recibir apoyo y conectar con nuevas oportunidades.
            </p>

            <Link href="/participar" className="hero-button">
              Participar ahora
            </Link>
          </div>

          <div className="hero-orbit-area">
            <div className="et-carousel">
              <div className="et-glow" />
              <div className="et-ring et-ring-one" />
              <div className="et-ring et-ring-two" />

              <div className="et-logo">
                <span>ET</span>
              </div>

              <Link href="/concursos" className="orbit-item orbit-one orbit-contests">
                <span>Concursos</span>
              </Link>

              <Link href="/categorias" className="orbit-item orbit-two orbit-categories">
                <span>Categorías</span>
              </Link>

              <Link href="/mentores" className="orbit-item orbit-three orbit-mentors">
                <span>Mentores</span>
              </Link>

              <Link href="/participar" className="orbit-item orbit-four orbit-participate">
                <span>Participar</span>
              </Link>

              <Link href="/about" className="orbit-item orbit-five orbit-about">
                <span>Acerca</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          min-height: 100vh;
          min-height: 100svh;
          overflow-x: clip;
          overflow-y: auto;
          background: linear-gradient(rgba(2, 6, 23, 0.22), rgba(2, 6, 23, 0.6));
          color: white;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: 8rem max(1rem, env(safe-area-inset-left)) 3rem;
        }

        .hero-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 70% 40%, rgba(34, 211, 238, 0.18), transparent 34%),
            radial-gradient(circle at 30% 70%, rgba(250, 204, 21, 0.16), transparent 36%),
            radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1), transparent 46%);
          pointer-events: none;
        }

        .hero-grid {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-content {
          padding: 2rem;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 0 24px rgba(250, 204, 21, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          overflow-wrap: anywhere;
        }

        .hero-eyebrow {
          margin-bottom: 1.25rem;
          font-size: 0.875rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          color: #67e8f9;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(3.4rem, 8vw, 8rem);
          line-height: 0.9;
          font-weight: 1000;
          text-transform: uppercase;
          letter-spacing: -0.06em;
          overflow-wrap: normal;
        }

        .hero-title span {
          display: block;
          color: #facc15;
        }

        .hero-title em,
        .hero-title strong {
          display: block;
          background: linear-gradient(90deg, #38bdf8, #f472b6, #facc15, #ffffff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-style: normal;
        }

        .hero-description {
          margin-top: 1.5rem;
          max-width: 36rem;
          font-size: 1.125rem;
          line-height: 1.8;
          color: #67e8f9;
          font-weight: 600;
          filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.16));
        }

        .hero-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 2.5rem;
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 46%),
            linear-gradient(90deg, #22d3ee, #ec4899, #facc15);
          padding: 1rem 2rem;
          color: white;
          font-weight: 1000;
          text-transform: uppercase;
          text-decoration: none;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.32);
          box-shadow:
            0 0 30px rgba(34, 211, 238, 0.3),
            0 0 38px rgba(250, 204, 21, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.45);
          transition: 0.35s cubic-bezier(.2,.8,.2,1);
        }

        .hero-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow:
            0 0 42px rgba(34, 211, 238, 0.72),
            0 0 70px rgba(236, 72, 153, 0.42),
            0 18px 50px rgba(250, 204, 21, 0.28);
        }

        .hero-orbit-area {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .et-carousel {
          position: relative;
          width: min(86vw, 520px);
          height: min(86vw, 520px);
          flex: 0 0 auto;
          border-radius: 999px;
        }

        .et-carousel:hover .orbit-item,
        .et-carousel:hover .et-ring-two {
          animation-play-state: paused;
        }

        .et-glow {
          position: absolute;
          inset: 40px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 30% 35%, rgba(34, 211, 238, 0.06), transparent 48%),
            radial-gradient(circle at 70% 35%, rgba(236, 72, 153, 0.05), transparent 52%),
            radial-gradient(circle at 50% 70%, rgba(250, 204, 21, 0.06), transparent 62%);
          filter: blur(12px);
          opacity: 0.42;
          animation: magicGlow 5s ease-in-out infinite;
        }

        .et-ring {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
        }

        .et-ring-one {
          inset: 0;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 0 24px rgba(250, 204, 21, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }

        .et-ring-two {
          inset: 90px;
          border: 1px dashed rgba(255, 255, 255, 0.16);
          box-shadow:
            0 0 24px rgba(250, 204, 21, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          animation: spinRing 16s linear infinite;
        }

        .et-logo {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 20;
          width: 176px;
          height: 176px;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 46px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.035);
          box-shadow:
            0 0 24px rgba(250, 204, 21, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          animation: logoFloat 4s ease-in-out infinite;
        }

        .et-logo span {
          font-size: 4rem;
          font-weight: 1000;
          letter-spacing: -0.12em;
          padding-right: 0.12em;
          background: linear-gradient(135deg, #ffffff 5%, #22d3ee 32%, #ec4899 62%, #facc15 92%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 0 6px rgba(34, 211, 238, 0.28))
            drop-shadow(0 0 10px rgba(250, 204, 21, 0.22));
        }

        .orbit-item {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 10;
          color: white;
          text-decoration: none;
          animation-duration: 24s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .orbit-item span {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 135px;
          padding: 13px 22px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.24), transparent 46%),
            linear-gradient(90deg, rgba(34, 211, 238, 0.78), rgba(236, 72, 153, 0.72), rgba(250, 204, 21, 0.78));
          color: white;
          font-weight: 900;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.34);
          position: relative;
          gap: 10px;
          box-shadow:
            0 0 24px rgba(34, 211, 238, 0.24),
            0 0 28px rgba(250, 204, 21, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition:
            scale 0.35s cubic-bezier(.2,.8,.2,1),
            translate 0.35s cubic-bezier(.2,.8,.2,1),
            border-color 0.35s ease,
            background 0.35s ease,
            box-shadow 0.35s ease;
        }

        .orbit-item span::before,
        .orbit-item span::after {
          content: "";
          box-sizing: border-box;
          display: block;
          flex: 0 0 auto;
        }

        .orbit-contests span {
          min-width: 152px;
          border-radius: 999px 999px 999px 26px;
        }

        .orbit-contests span::before {
          width: 15px;
          height: 23px;
          border: 2px solid rgba(255, 255, 255, 0.86);
          border-radius: 999px 999px 9px 9px;
          background:
            linear-gradient(rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.06));
          box-shadow:
            0 9px 0 -5px rgba(255, 255, 255, 0.86),
            0 14px 0 -6px rgba(255, 255, 255, 0.72);
        }

        .orbit-categories span {
          min-width: 126px;
          min-height: 74px;
          border-radius: 24px;
        }

        .orbit-categories span::before {
          width: 28px;
          height: 22px;
          border: 2px solid rgba(255, 255, 255, 0.86);
          border-radius: 6px;
          background:
            linear-gradient(90deg, transparent 46%, rgba(255, 255, 255, 0.82) 46% 54%, transparent 54%),
            linear-gradient(rgba(255, 255, 255, 0.16), transparent);
        }

        .orbit-mentors span {
          min-width: 142px;
          border-radius: 999px 999px 24px 999px;
        }

        .orbit-mentors span::before {
          width: 30px;
          height: 22px;
          border: 2px solid rgba(255, 255, 255, 0.86);
          border-radius: 5px;
          background:
            linear-gradient(rgba(255, 255, 255, 0.14), transparent),
            linear-gradient(90deg, transparent 0 38%, rgba(255, 255, 255, 0.55) 38% 44%, transparent 44%),
            linear-gradient(0deg, transparent 0 55%, rgba(255, 255, 255, 0.45) 55% 61%, transparent 61%);
          box-shadow:
            8px -8px 0 -5px rgba(255, 255, 255, 0.9);
        }

        .orbit-participate span {
          min-width: 150px;
          clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          border-radius: 16px;
        }

        .orbit-participate span::before {
          width: 31px;
          height: 22px;
          border: 2px solid rgba(255, 255, 255, 0.86);
          border-radius: 7px;
          background:
            radial-gradient(circle, transparent 0 4px, rgba(255, 255, 255, 0.86) 4.5px 6px, transparent 6.5px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.76) 0 8px, transparent 8px),
            linear-gradient(rgba(255, 255, 255, 0.14), transparent);
        }

        .orbit-about span {
          width: 92px;
          min-width: 92px;
          height: 92px;
          border-radius: 999px;
          padding: 0;
          flex-direction: column;
          gap: 5px;
          font-size: 0.72rem;
        }

        .orbit-about span::before {
          width: 26px;
          height: 26px;
          border: 2px solid rgba(255, 255, 255, 0.86);
          border-radius: 999px;
          box-shadow:
            10px 10px 0 -8px rgba(255, 255, 255, 0.86);
          transform: rotate(-8deg);
        }

        .orbit-about span::after {
          display: none;
        }

        .orbit-item:hover {
          z-index: 50;
        }

        .orbit-item:hover span {
          scale: 1.18;
          translate: 0 -3px;
          border-color: rgba(255, 255, 255, 0.42);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.34), transparent 46%),
            linear-gradient(90deg, #22d3ee, #ec4899, #facc15);
          box-shadow:
            0 0 38px rgba(34, 211, 238, 0.85),
            0 0 58px rgba(236, 72, 153, 0.42),
            0 0 80px rgba(250, 204, 21, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
        }

        .orbit-one {
          animation-name: orbitOne;
        }

        .orbit-two {
          animation-name: orbitTwo;
        }

        .orbit-three {
          animation-name: orbitThree;
        }

        .orbit-four {
          animation-name: orbitFour;
        }

        .orbit-five {
          animation-name: orbitFive;
        }

        @keyframes orbitOne {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(220px) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(220px) rotate(-360deg);
          }
        }

        @keyframes orbitTwo {
          from {
            transform: translate(-50%, -50%) rotate(72deg) translateX(220px) rotate(-72deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(432deg) translateX(220px) rotate(-432deg);
          }
        }

        @keyframes orbitThree {
          from {
            transform: translate(-50%, -50%) rotate(144deg) translateX(220px) rotate(-144deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(504deg) translateX(220px) rotate(-504deg);
          }
        }

        @keyframes orbitFour {
          from {
            transform: translate(-50%, -50%) rotate(216deg) translateX(220px) rotate(-216deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(576deg) translateX(220px) rotate(-576deg);
          }
        }

        @keyframes orbitFive {
          from {
            transform: translate(-50%, -50%) rotate(288deg) translateX(220px) rotate(-288deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(648deg) translateX(220px) rotate(-648deg);
          }
        }

        @keyframes spinRing {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -54%) scale(1.06);
          }
        }

        @keyframes magicGlow {
          0%, 100% {
            opacity: 0.28;
            transform: scale(1);
          }
          50% {
            opacity: 0.46;
            transform: scale(1.04);
          }
        }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .hero-content {
            padding: 1.5rem;
            border-radius: 24px;
          }

          .hero-eyebrow {
            letter-spacing: 0.18em;
          }

          .hero-title {
            font-size: clamp(2.7rem, 15vw, 5.8rem);
          }

          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }

          .et-carousel {
            width: min(88vw, 380px);
            height: min(88vw, 380px);
          }

          .et-logo {
            width: 135px;
            height: 135px;
            border-radius: 34px;
          }

          .et-logo span {
            font-size: 3rem;
          }

          .et-ring-two {
            inset: 65px;
          }

          .orbit-item span {
            min-width: 100px;
            padding: 10px 14px;
            font-size: 0.78rem;
          }

          @keyframes orbitOne {
            from {
              transform: translate(-50%, -50%) rotate(0deg) translateX(160px) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg) translateX(160px) rotate(-360deg);
            }
          }

          @keyframes orbitTwo {
            from {
              transform: translate(-50%, -50%) rotate(72deg) translateX(160px) rotate(-72deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(432deg) translateX(160px) rotate(-432deg);
            }
          }

          @keyframes orbitThree {
            from {
              transform: translate(-50%, -50%) rotate(144deg) translateX(160px) rotate(-144deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(504deg) translateX(160px) rotate(-504deg);
            }
          }

          @keyframes orbitFour {
            from {
              transform: translate(-50%, -50%) rotate(216deg) translateX(160px) rotate(-216deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(576deg) translateX(160px) rotate(-576deg);
            }
          }

          @keyframes orbitFive {
            from {
              transform: translate(-50%, -50%) rotate(288deg) translateX(160px) rotate(-288deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(648deg) translateX(160px) rotate(-648deg);
            }
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            align-items: flex-start;
            padding-top: 7rem;
          }

          .hero-content {
            padding: 1.2rem;
          }

          .hero-description {
            font-size: 1rem;
            line-height: 1.65;
          }

          .hero-button {
            width: 100%;
            margin-top: 1.6rem;
            padding-inline: 1rem;
          }

          .et-carousel {
            width: min(90vw, 320px);
            height: min(90vw, 320px);
          }

          .et-logo {
            width: 112px;
            height: 112px;
            border-radius: 28px;
          }

          .et-logo span {
            font-size: 2.45rem;
          }

          .et-ring-two {
            inset: 54px;
          }

          .orbit-item span {
            min-width: 86px;
            padding: 8px 10px;
            font-size: 0.68rem;
          }

          .orbit-about span {
            width: 72px;
            min-width: 72px;
            height: 72px;
          }

          @keyframes orbitOne {
            from {
              transform: translate(-50%, -50%) rotate(0deg) translateX(132px) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg) translateX(132px) rotate(-360deg);
            }
          }

          @keyframes orbitTwo {
            from {
              transform: translate(-50%, -50%) rotate(72deg) translateX(132px) rotate(-72deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(432deg) translateX(132px) rotate(-432deg);
            }
          }

          @keyframes orbitThree {
            from {
              transform: translate(-50%, -50%) rotate(144deg) translateX(132px) rotate(-144deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(504deg) translateX(132px) rotate(-504deg);
            }
          }

          @keyframes orbitFour {
            from {
              transform: translate(-50%, -50%) rotate(216deg) translateX(132px) rotate(-216deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(576deg) translateX(132px) rotate(-576deg);
            }
          }

          @keyframes orbitFive {
            from {
              transform: translate(-50%, -50%) rotate(288deg) translateX(132px) rotate(-288deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(648deg) translateX(132px) rotate(-648deg);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-item,
          .et-ring-two,
          .et-logo,
          .et-glow {
            animation: none;
          }

          .orbit-one {
            transform: translate(-50%, -50%) rotate(0deg) translateX(min(42vw, 220px)) rotate(0deg);
          }

          .orbit-two {
            transform: translate(-50%, -50%) rotate(72deg) translateX(min(42vw, 220px)) rotate(-72deg);
          }

          .orbit-three {
            transform: translate(-50%, -50%) rotate(144deg) translateX(min(42vw, 220px)) rotate(-144deg);
          }

          .orbit-four {
            transform: translate(-50%, -50%) rotate(216deg) translateX(min(42vw, 220px)) rotate(-216deg);
          }

          .orbit-five {
            transform: translate(-50%, -50%) rotate(288deg) translateX(min(42vw, 220px)) rotate(-288deg);
          }
        }
      `}</style>
    </main>
  );
}
