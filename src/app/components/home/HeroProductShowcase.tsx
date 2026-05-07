import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Plus, ShieldCheck, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { kitAsProduct, kitFromRow, productFromRow } from '../../../lib/mappers';
import type { Product } from '../../../lib/types';
import { formatARS } from '../../../lib/format';
import { useCart } from '../../context/CartContext';

export function HeroProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadShowcase() {
      const [{ data: productRows }, { data: kitRows }] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('status', 'active')
          .order('is_best_seller', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('kits')
          .select('*')
          .eq('is_active', true)
          .eq('status', 'active')
          .order('is_best_seller', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(2),
      ]);

      const mappedProducts = (productRows ?? []).map(productFromRow);
      const mappedKits = (kitRows ?? []).map(row => kitAsProduct(kitFromRow(row)));
      setProducts([...mappedKits, ...mappedProducts].slice(0, 5));
    }

    loadShowcase();
  }, []);

  if (products.length === 0) {
    return null;
  }

  const activeProduct = products[Math.min(activeIndex, products.length - 1)];
  const isOutOfStock = !activeProduct.isKit && (activeProduct.stock ?? 0) <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(activeProduct);
    toast.success(`${activeProduct.name} agregado al carrito`);
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.7 }}
      className="rounded-2xl border border-cyan-300/20 bg-[#071018]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Vidriera rápida
        </span>
        <Link to="/productos" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-200 hover:text-white">
          Ver todo
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
        <img
          src={activeProduct.image}
          alt={activeProduct.name}
          className="h-48 w-full object-cover opacity-95 transition duration-500 sm:h-52"
        />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase text-cyan-200">
          {activeProduct.isKit ? 'Kit destacado' : activeProduct.isBestSeller ? 'Más pedido' : 'Producto destacado'}
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">{activeProduct.name}</h2>
        <p className="mt-2 min-h-[42px] text-sm leading-relaxed text-slate-400 line-clamp-2">
          {activeProduct.shortDescription}
        </p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">{activeProduct.isKit ? 'Combo' : isOutOfStock ? 'Sin stock' : `${activeProduct.stock ?? 0} unidades`}</p>
            <p className="text-3xl font-black text-white">{formatARS(activeProduct.price)}</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0EA5E9] text-white transition hover:bg-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2">
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`group relative aspect-square overflow-hidden rounded-lg border transition ${
              index === activeIndex ? 'border-cyan-300' : 'border-white/10 hover:border-cyan-300/40'
            }`}
            aria-label={`Ver ${product.name}`}
          >
            <img src={product.image} alt="" className="h-full w-full object-cover opacity-80 group-hover:opacity-100" />
            {index === activeIndex && <Plus className="absolute inset-0 m-auto h-5 w-5 rounded-full bg-cyan-400 p-1 text-black" />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
