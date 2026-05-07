import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, PackageCheck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { kitFromRow } from '../../../lib/mappers';
import type { Kit } from '../../../lib/types';
import { formatARS } from '../../../lib/format';

export const FeaturedKits = () => {
  const [kits, setKits] = useState<Kit[]>([]);

  useEffect(() => {
    supabase
      .from('kits')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'active')
      .eq('is_best_seller', true)
      .then(({ data }) => {
        if (data) setKits(data.map(kitFromRow));
      });
  }, []);

  return (
    <section className="bg-[#050607] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#38BDF8] font-black text-xs uppercase tracking-[0.24em]">
              Kits
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Kits completos para comprar rápido
            </h2>
            <p className="mt-3 text-slate-400 max-w-2xl">
              Combos cerrados con varios productos juntos, listos para agregar al carrito.
            </p>
          </motion.div>
          <Link
            to="/category/kits"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
          >
            Todos los kits
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {kits.map((kit, index) => (
            <motion.div
              key={kit.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-[#0B0F14] transition-all hover:border-cyan-300/35 hover:shadow-xl hover:shadow-cyan-950/25">
                <div className="relative h-64 overflow-hidden bg-black">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#0EA5E9] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                    <Star className="w-4 h-4 fill-current" />
                    Recomendado
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur">
                    {kit.items.length} productos
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-white mb-2">
                    {kit.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {kit.shortDescription}
                  </p>

                  <div className="mb-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-slate-300">
                    <PackageCheck className="h-4 w-4 text-[#38BDF8]" />
                    Listo para sumar al carrito y coordinar pago
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-2xl font-black text-white">
                      {formatARS(kit.price)}
                    </span>
                    <Link
                      to={`/product/${kit.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#0EA5E9] px-5 py-3 text-sm font-black text-white transition hover:bg-[#38BDF8]"
                    >
                      Ver kit
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
