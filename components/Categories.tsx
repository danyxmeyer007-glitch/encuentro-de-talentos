const categories = [
  {
    icon: "🎤",
    title: "Canto",
    description: "Voces solistas, dúos, interpretación vocal y presencia escénica.",
  },
  {
    icon: "🎙️",
    title: "Rap & Freestyle",
    description: "Flow, lírica, improvisación, barras y dominio del escenario.",
  },
  {
    icon: "🎧",
    title: "Beats",
    description: "Producción musical, instrumentales, loops y sonido original.",
  },
  {
    icon: "🎸",
    title: "Instrumentistas",
    description: "Guitarra, piano, saxofón, batería, cuerdas, viento y más.",
  },
  {
    icon: "💃",
    title: "Danza",
    description: "Urbano, folklórico, contemporáneo, ballet, salsa y coreografía.",
  },
  {
    icon: "🎭",
    title: "Teatro & Actuación",
    description: "Monólogos, escenas, improvisación, actuación frente a cámara y voz.",
  },
  {
    icon: "📸",
    title: "Fotografía",
    description: "Retrato, documental, editorial, eventos y narrativa visual.",
  },
  {
    icon: "🎬",
    title: "Cine & Video",
    description: "Dirección, edición, cortometrajes, videoclips y contenido digital.",
  },
  {
    icon: "🎨",
    title: "Arte Digital",
    description: "Ilustración, concept art, animación, 3D y piezas digitales.",
  },
  {
    icon: "🧵",
    title: "Diseño de Moda",
    description: "Styling, vestuario, costura, pasarela y propuesta visual.",
  },
  {
    icon: "✍️",
    title: "Escritura & Poesía",
    description: "Poesía, spoken word, cuento, guion, letras y narrativa.",
  },
  {
    icon: "🎙️",
    title: "Comedia",
    description: "Stand-up, sketches, personajes, timing y creación humorística.",
  },
  {
    icon: "💄",
    title: "Maquillaje Artístico",
    description: "Caracterización, belleza creativa, efectos, fantasía y performance.",
  },
  {
    icon: "🎛️",
    title: "DJ & Mezcla",
    description: "Selección musical, mezcla en vivo, energía y lectura del público.",
  },
  {
    icon: "🖌️",
    title: "Artes Plásticas",
    description: "Pintura, escultura, muralismo, collage, cerámica y técnicas mixtas.",
  },
  {
    icon: "✨",
    title: "Talento Libre",
    description: "Magia, circo, performance, nuevas disciplinas y habilidades únicas.",
  },
];

export default function Categories() {
  return (
    <section id="categorias" className="relative px-4 py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-x-8 top-10 h-56 rounded-full bg-[radial-gradient(circle_at_28%_45%,rgba(34,211,238,0.1),transparent_48%),radial-gradient(circle_at_70%_45%,rgba(236,72,153,0.08),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(250,204,21,0.1),transparent_62%)] blur-[22px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Categorías 2026
          </p>
          <h1 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-4xl font-black uppercase leading-none text-transparent md:text-6xl">
            Habilidades Artísticas
          </h1>
          <p className="mt-5 text-lg font-medium leading-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.18)]">
            Encuentra tu disciplina, prepara tu propuesta y participa en una
            plataforma diseñada para descubrir talento real en muchas formas de
            expresión.
          </p>
        </div>

        <div className="mb-8 rounded-[32px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.11),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.22)]">
            Música • Escena • Imagen • Movimiento • Escritura • Arte Visual • Nuevas disciplinas
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.title}
              className="group rounded-[28px] border border-white/[0.16] bg-white/[0.035] p-5 shadow-[0_0_18px_rgba(250,204,21,0.09),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_0_24px_rgba(34,211,238,0.16),0_0_30px_rgba(250,204,21,0.12),inset_0_1px_0_rgba(255,255,255,0.18)]"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent_46%),linear-gradient(90deg,rgba(34,211,238,0.72),rgba(236,72,153,0.66),rgba(250,204,21,0.72))] text-3xl shadow-[0_0_18px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.26)]">
                {category.icon}
              </div>

              <h2 className="bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 bg-clip-text text-xl font-black uppercase leading-tight text-transparent">
                {category.title}
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-cyan-300 drop-shadow-[0_0_7px_rgba(34,211,238,0.16)]">
                {category.description}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm font-medium leading-7 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.16)]">
          ¿Tu talento no aparece aquí? También estamos abiertos a habilidades
          artísticas emergentes, propuestas híbridas y formatos nuevos.
        </p>
      </div>
    </section>
  );
}
