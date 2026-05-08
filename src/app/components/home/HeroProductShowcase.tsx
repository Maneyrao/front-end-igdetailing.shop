import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Pause, Play, ShieldCheck, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { kitAsProduct, kitFromRow, productFromRow } from '../../../lib/mappers';
import type { Product } from '../../../lib/types';
import { formatARS } from '../../../lib/format';
import { useCart } from '../../context/CartContext';

export function HeroProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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

  useEffect(() => {
    if (products.length <= 1 || isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isPaused, products.length]);

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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Vidriera rápida
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-100 transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
            aria-label={isPaused ? 'Reproducir pasarela' : 'Pausar pasarela'}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
          <Link to="/productos" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-200 hover:text-white">
            Ver todo
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeProduct.id}
            src={activeProduct.image}
            alt={activeProduct.name}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.96, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
            className="h-48 w-full object-cover sm:h-52"
          />
        </AnimatePresence>
        <div className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
          {activeIndex + 1} / {products.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeProduct.id}-copy`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-5"
        >
          <p className="text-xs font-semibold uppercase text-cyan-200">
            {activeProduct.isKit ? 'Kit destacado' : activeProduct.isBestSeller ? 'Más pedido' : 'Producto destacado'}
          </p>
          <h2 className="mt-2 min-h-[64px] text-2xl font-black leading-tight text-white">{activeProduct.name}</h2>
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
              aria-label={`Agregar ${activeProduct.name} al carrito`}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <motion.div
          key={`${activeProduct.id}-progress-${isPaused ? 'paused' : 'playing'}`}
          className="h-full rounded-full bg-[#38BDF8]"
          initial={{ width: isPaused ? '100%' : '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: isPaused ? 0 : 4, ease: 'linear' }}
        />
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2">
        {products.map((product, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setIsPaused(true);
              }}
              className={`group relative aspect-[4/5] overflow-hidden rounded-lg border transition ${
                isActive ? 'border-cyan-300 bg-cyan-300/10' : 'border-white/10 bg-white/[0.03] hover:border-cyan-300/40'
              }`}
              aria-label={`Ver ${product.name}`}
            >
              <img src={product.image} alt="" className="h-full w-full object-cover opacity-75 transition group-hover:opacity-100" />
              <span className={`absolute inset-x-1 bottom-1 rounded bg-black/70 px-1 py-1 text-[9px] font-black leading-tight text-white transition ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                {formatARS(product.price)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2" aria-label="Productos de la pasarela">
        {products.map((product, index) => (
          <Link
            key={`${product.id}-name`}
            to={`/product/${product.slug}`}
            onMouseEnter={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition ${
              index === activeIndex ? 'bg-cyan-300' : 'bg-white/15 hover:bg-cyan-300/50'
            }`}
            aria-label={`Abrir ${product.name}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
