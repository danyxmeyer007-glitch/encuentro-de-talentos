const principles = [
  {
    title: "El talento vale más que la popularidad",
    text: "ET busca a las personas con habilidad real, no solamente a quienes ya tienen fama o grandes audiencias.",
  },
  {
    title: "La comunidad impulsa el crecimiento",
    text: "Los participantes no son clientes: son parte esencial del ecosistema que ayuda a descubrir, apoyar y elevar talento.",
  },
  {
    title: "La IA ayuda, pero no reemplaza a las personas",
    text: "La inteligencia artificial orienta, evalúa y acompaña, mientras mentores, profesores y expertos siguen siendo claves.",
  },
  {
    title: "Todos merecen una oportunidad",
    text: "Edad, país, experiencia o equipo no deben cerrar puertas. Lo importante es el talento y las ganas de mejorar.",
  },
];

const builders = [
  "Creadores",
  "Mentores",
  "Profesionales",
  "Empresas",
  "Comunidad",
];

const goals = [
  "Lanzar la primera temporada de canto.",
  "Conseguir los primeros 100 participantes.",
  "Incorporar productores musicales e instrumentistas.",
  "Lanzar el primer proyecto colaborativo oficial.",
  "Publicar la primera canción nacida dentro de ET.",
  "Construir una red de mentores y expertos.",
  "Convertir ET en una referencia para descubrir talento en Latinoamérica.",
];

const visionPoints = [
  "Descubrir artistas antes de que sean famosos.",
  "Ayudar a desarrollar nuevas carreras creativas.",
  "Crear colaboraciones entre países.",
  "Conectar talento con oportunidades reales.",
  "Construir una comunidad donde el talento tenga más valor que la popularidad.",
];

export default function About() {
  return (
    <section className="et-showcase-section relative px-4 py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-x-8 top-10 h-56 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Visión 2030
            </p>
            <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
              Encuentro de Talentos
            </h1>
            <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
              Nacimos para crear una oportunidad real para quienes cantan,
              producen, tocan instrumentos, crean arte y tienen una habilidad
              que merece ser descubierta.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">
              Nuestra frase
            </p>
            <p className="mt-5 bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-3xl font-black uppercase leading-tight text-transparent md:text-4xl">
              Diviértete.
              <br />
              Participa.
              <br />
              Gana premios.
            </p>
            <p className="mt-5 text-sm font-medium leading-7 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
              Pero sobre todo: descubre hasta dónde puede llegar tu talento.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)] lg:col-span-2 md:p-8">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
              Nuestra razón de existir
            </p>
            <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-3xl font-black uppercase leading-tight text-transparent md:text-5xl">
              Talento con una puerta abierta
            </h2>
            <p className="mt-5 text-base font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.16)]">
              Muchas personas tienen talento, pero no todas reciben una
              oportunidad justa para ser vistas. Encuentro de Talentos existe
              para que cualquier persona pueda mostrar sus habilidades, recibir
              retroalimentación, mejorar y encontrar oportunidades reales sin
              depender de su fama, ubicación o recursos económicos.
            </p>
          </article>

          <article className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)] md:p-8">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
              No somos
            </p>
            <p className="text-2xl font-black uppercase leading-tight text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              Una página de concursos más.
            </p>
            <p className="mt-4 text-sm font-medium leading-7 text-cyan-300">
              ET se está construyendo como una plataforma para descubrir,
              desarrollar y lanzar talento creativo.
            </p>
          </article>
        </div>

        <section className="mt-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            Punto de encuentro
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {builders.map((builder) => (
              <div
                key={builder}
                className="rounded-2xl border border-white/12 bg-white/[0.025] p-4 text-center text-sm font-black uppercase tracking-[0.16em] text-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]"
              >
                {builder}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-8 max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Principios fundamentales
            </p>
            <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-3xl font-black uppercase leading-none text-transparent md:text-5xl">
              La cultura que guía ET
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="rounded-[28px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_0_24px_rgba(34,211,238,0.16),0_0_30px_rgba(250,204,21,0.12),inset_0_1px_0_rgba(255,255,255,0.18)]"
              >
                <h3 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-xl font-black uppercase leading-tight text-transparent">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-6 text-cyan-300 drop-shadow-[0_0_7px_rgba(34,211,238,0.16)]">
                  {principle.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
              Objetivos
            </p>
            <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-3xl font-black uppercase leading-tight text-transparent md:text-5xl">
              Lo que vamos a lograr
            </h2>
          </article>

          <div className="grid gap-3">
            {goals.map((goal, index) => (
              <div
                key={goal}
                className="flex gap-4 rounded-2xl border border-white/12 bg-white/[0.025] p-4 shadow-[0_0_14px_rgba(34,211,238,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_46%),linear-gradient(90deg,rgba(34,211,238,0.72),rgba(236,72,153,0.66),rgba(250,204,21,0.72))] text-sm font-black text-white shadow-[0_0_18px_rgba(34,211,238,0.16)]">
                  {index + 1}
                </span>
                <p className="text-sm font-medium leading-6 text-cyan-300">
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-6 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
                2030
              </p>
              <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-3xl font-black uppercase leading-none text-transparent md:text-5xl">
                Mi oportunidad comenzó en Encuentro de Talentos
              </h2>
              <p className="mt-5 text-sm font-medium leading-7 text-cyan-300">
                Esa es la frase que queremos que miles de creadores puedan
                decir en los próximos años.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {visionPoints.map((point) => (
                <p
                  key={point}
                  className="rounded-2xl border border-white/12 bg-white/[0.025] p-4 text-sm font-medium leading-6 text-cyan-300 drop-shadow-[0_0_7px_rgba(34,211,238,0.14)]"
                >
                  {point}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
