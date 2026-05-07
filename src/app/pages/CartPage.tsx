import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { formatARS } from '../../lib/format';
import { supabase } from '../../lib/supabase';
import { productFromRow } from '../../lib/mappers';
import type { Product } from '../../lib/types';
import { BackLink } from '../components/BackLink';
import { FREE_SHIPPING_FROM, STANDARD_SHIPPING_COST } from '../../lib/business';

export default function CartPage() {
  const { items, addToCart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const subtotal = getCartTotal();
  const freeShippingFrom = FREE_SHIPPING_FROM;
  const shipping = subtotal >= freeShippingFrom ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shipping;
  const amountForFreeShipping = Math.max(0, freeShippingFrom - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingFrom) * 100));
  const cartKey = useMemo(() => items.map(item => item.product.id).join('|'), [items]);

  useEffect(() => {
    async function loadRecommendations() {
      const cartIds = new Set(items.map(item => item.product.id));
      const preferredCategories = new Set(items.map(item => item.product.category).filter(category => category !== 'kits'));

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'active')
        .gt('stock', 0)
        .order('is_best_seller', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(12);

      const mapped = (data ?? []).map(productFromRow).filter(product => !cartIds.has(product.id));
      const contextual = mapped.filter(product => preferredCategories.has(product.category));
      const accessories = mapped.filter(product => product.category === 'accessories');
      const combined = [...contextual, ...accessories, ...mapped].filter(
        (product, index, list) => list.findIndex(item => item.id === product.id) === index
      );

      setRecommendations(combined.slice(0, 3));
    }

    loadRecommendations();
  }, [cartKey]);

  const handleAddRecommendation = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  const canIncrease = (item: { product: Product; quantity: number }) => (
    item.product.isKit || item.quantity < (item.product.stock ?? 0)
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050607] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-700 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-400 mb-8">Sumá productos o arrancá por un kit completo.</p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-[#0EA5E9] text-white px-8 py-4 rounded-lg hover:bg-[#38BDF8] transition font-semibold"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050607] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackLink fallback="/productos" label="Seguir comprando" className="mb-8" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Carrito</h1>
          <p className="text-gray-400">
            {items.length} {items.length === 1 ? 'producto listo' : 'productos listos'} para confirmar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-cyan-300/20 bg-[#071018] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-black text-white">
                    <Truck className="h-4 w-4 text-[#38BDF8]" />
                    {amountForFreeShipping === 0
                      ? 'Ya tenés envío gratis'
                      : `Sumá ${formatARS(amountForFreeShipping)} para envío gratis`}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">El total se actualiza antes de confirmar la compra.</p>
                </div>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-slate-300">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  className="h-full rounded-full bg-[#38BDF8]"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, scale: 0.98 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0B0F14] rounded-xl p-4 sm:p-6 border border-white/10 transition hover:border-cyan-300/25"
              >
                <div className="flex gap-4">
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="hover:text-[#0EA5E9] transition"
                      >
                        <h3 className="text-white font-bold text-lg">
                          {item.product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition p-2 -m-2"
                        aria-label="Quitar del carrito"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {item.product.shortDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center bg-white/[0.06] rounded-lg w-fit">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-700 transition rounded-l-lg"
                          aria-label="Bajar cantidad"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="px-4 text-white font-semibold min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={!canIncrease(item)}
                          className="p-2 hover:bg-gray-700 transition rounded-r-lg disabled:cursor-not-allowed disabled:opacity-45"
                          aria-label="Subir cantidad"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {formatARS(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-400">
                            {formatARS(item.product.price)} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>

            {recommendations.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/10 bg-[#0B0F14] p-5"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#38BDF8]">
                      También disponibles
                    </p>
                    <h2 className="mt-2 text-xl font-black text-white">Sumar al pedido</h2>
                  </div>
                  <Link to="/productos" className="text-sm font-bold text-cyan-200 hover:text-white">
                    Ver más
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {recommendations.map((product) => (
                    <article key={product.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                      <Link to={`/product/${product.slug}`} className="block">
                        <img src={product.image} alt={product.name} className="h-28 w-full rounded-lg object-cover" />
                        <h3 className="mt-3 line-clamp-2 text-sm font-black text-white">{product.name}</h3>
                        <p className="mt-1 text-sm font-bold text-[#38BDF8]">{formatARS(product.price)}</p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAddRecommendation(product)}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-[#071018] transition hover:bg-cyan-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Sumar
                      </button>
                    </article>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0B0F14] rounded-xl p-6 border border-white/10 sticky top-24"
            >
              <h2 className="text-2xl font-black text-white mb-6">Resumen</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatARS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'GRATIS' : formatARS(shipping)}</span>
                </div>
                {subtotal < freeShippingFrom && subtotal > 0 && (
                  <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-3 text-sm text-cyan-100">
                    Sumá {formatARS(amountForFreeShipping)} más para envío gratis.
                  </div>
                )}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span>{formatARS(total)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-[#0EA5E9] text-white font-black py-4 rounded-lg hover:bg-[#38BDF8] transition text-center"
              >
                Finalizar compra
              </Link>

              <div className="mt-6 space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#38BDF8]" />
                  Envío gratis desde {formatARS(freeShippingFrom)}
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#38BDF8]" />
                  Pago manual por transferencia
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#38BDF8]" />
                  Pedido confirmado por WhatsApp
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
