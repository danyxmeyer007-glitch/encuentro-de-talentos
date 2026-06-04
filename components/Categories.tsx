const categories = [
  {
    icon: "🎤",
    title: "Canto",
    description: "Demuestra tu voz y compite por reconocimiento.",
  },
  {
    icon: "🎵",
    title: "Beats",
    description: "Presenta tus producciones e instrumentales.",
  },
  {
    icon: "🎸",
    title: "Instrumentistas",
    description: "Guitarra, piano, saxofón, batería y más.",
  },
  {
    icon: "🎨",
    title: "Arte Digital",
    description: "Próximamente: ilustración, diseño y creatividad visual.",
  },
];

export default function Categories() {
  return (
    <section id="categorias" className="section-padding">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="section-title">Categorías Iniciales</h2>
        <p className="section-subtitle">
          Comenzamos con música y talento creativo. Después creceremos hacia más disciplinas.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category.title} className="glass-card">
              <div className="mb-4 text-5xl">{category.icon}</div>
              <h3 className="mb-3 text-2xl font-bold text-yellow-300">
                {category.title}
              </h3>
              <p className="text-white/70">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}