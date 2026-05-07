import { Link } from 'react-router';
import { ArrowRight, Droplets, Package, Shield, Sofa, Wrench } from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  {
    name: 'Lavado',
    slug: 'wash',
    icon: Droplets,
    description: 'Shampoo, descontaminado y mantenimiento seguro',
  },
  {
    name: 'Interior',
    slug: 'interior',
    icon: Sofa,
    description: 'Limpieza de plásticos, telas, cuero y aromas',
  },
  {
    name: 'Protección',
    slug: 'protection',
    icon: Shield,
    description: 'Ceras, selladores y brillo de larga duración',
  },
  {
    name: 'Accesorios',
    slug: 'accessories',
    icon: Wrench,
    description: 'Microfibras, aplicadores y herramientas de trabajo',
  },
  {
    name: 'Kits',
    slug: 'kits',
    icon: Package,
    description: 'Combos armados para comprar sin vueltas',
    featured: true
  }
];

export const CategoryNavigation = () => {
  return (
    <section className="border-y border-white/10 bg-[#0B0F14] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#38BDF8]">
              Catálogo técnico
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Elegí por etapa del proceso
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Comprá por objetivo: lavar, renovar interior, proteger pintura o armar un kit completo.
            </p>
          </div>
          <Link
            to="/category/kits"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-300/20 px-4 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/10"
          >
            Ver kits recomendados
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                to={`/category/${category.slug}`}
                className={`group flex h-full min-h-[190px] flex-col justify-between rounded-xl border p-5 transition ${
                  category.featured
                    ? 'border-cyan-300/40 bg-[#0EA5E9]/15 shadow-lg shadow-cyan-950/30'
                    : 'border-white/10 bg-white/[0.035] hover:border-cyan-300/30 hover:bg-white/[0.06]'
                }`}
              >
                <div>
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-lg ${
                    category.featured ? 'bg-cyan-300/20' : 'bg-white/10'
                  }`}>
                    <category.icon className="h-5 w-5 text-[#38BDF8]" />
                  </div>
                  <h3 className="text-lg font-black text-white">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {category.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Comprar
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-[#38BDF8]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
