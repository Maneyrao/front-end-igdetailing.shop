import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { productFromRow } from '../../../lib/mappers';
import type { Product } from '../../../lib/types';
import { useCart } from '../../context/CartContext';
import { formatARS } from '../../../lib/format';

export const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'active')
      .eq('is_best_seller', true)
      .limit(4)
      .then(({ data }) => {
        if (data) setBestSellers(data.map(productFromRow));
      });
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    if ((product.stock ?? 0) <= 0) return;
    addToCart(product);
  };

  return (
    <section className="border-y border-white/10 bg-[#0B0F14] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#38BDF8] font-black text-xs uppercase tracking-[0.24em]">
              Más pedidos
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">
              Productos que salen siempre
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Básicos confiables para mantener el auto limpio, brillante y protegido.
            </p>
          </motion.div>
          <Link
            to="/category/wash"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
          >
            Explorar productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, index) => {
            const isOutOfStock = (product.stock ?? 0) <= 0;
            return (
            <motion.div
              key={product.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/product/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#101720] transition-all hover:border-cyan-300/35 hover:shadow-lg hover:shadow-cyan-950/20"
              >
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                    isOutOfStock
                      ? 'bg-red-500/15 text-red-200 ring-1 ring-red-400/25'
                      : 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/20'
                  }`}>
                    {isOutOfStock ? 'Sin stock' : `${product.stock ?? 0} u.`}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-white font-black mb-2 group-hover:text-[#38BDF8] transition">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                    {product.shortDescription}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-white">
                      {formatARS(product.price)}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0EA5E9] text-white transition hover:bg-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Agregar al carrito"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
