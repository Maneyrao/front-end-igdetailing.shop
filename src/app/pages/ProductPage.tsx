import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Minus, Plus, Package, Info, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { kitAsProduct, kitFromRow, productFromRow } from '../../lib/mappers';
import type { Product } from '../../lib/types';
import { useCart } from '../context/CartContext';
import { formatARS } from '../../lib/format';
import { BackLink } from '../components/BackLink';
import { CATEGORY_LABELS } from '../../lib/catalog';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setRelatedProducts([]);

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('status', 'active')
        .maybeSingle();

      if (productError) {
        console.error('Error loading product:', productError);
        setProduct(null);
        setLoading(false);
        return;
      }

      if (productData) {
        setProduct(productFromRow(productData));
        setLoading(false);
        return;
      }

      const { data: kitData, error: kitError } = await supabase
        .from('kits')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('status', 'active')
        .maybeSingle();

      if (kitError) {
        console.error('Error loading kit:', kitError);
      }

      setProduct(kitData ? kitAsProduct(kitFromRow(kitData)) : null);
      setLoading(false);
    }

    loadProduct();
  }, [slug]);

  // Fetch related products once main product is loaded
  useEffect(() => {
    if (!product || product.isKit || !product.relatedProducts || product.relatedProducts.length === 0) return;
    supabase
      .from('products')
      .select('*')
      .in('slug', product.relatedProducts)
      .eq('is_active', true)
      .eq('status', 'active')
      .then(({ data }) => {
        if (data) setRelatedProducts(data.map(productFromRow));
      });
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050607] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050607] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Producto no encontrado</h1>
          <Link to="/" className="text-[#0EA5E9] hover:text-[#38BDF8]">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.isKit && (product.stock ?? 0) <= 0) return;
    addToCart(product, quantity);
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((current) => Math.min(maxQuantity, Math.max(1, current + delta)));
  };

  const isOutOfStock = !product.isKit && (product.stock ?? 0) <= 0;
  const maxQuantity = product.isKit ? 99 : Math.max(1, product.stock ?? 0);
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050607] pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackLink fallback={`/category/${product.category}`} label="Volver" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F14]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.isKit && (
                <div className="absolute top-4 right-4 bg-[#0EA5E9] text-white px-4 py-2 rounded-lg font-black uppercase tracking-wide text-xs">
                  Kit completo
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-block bg-white/[0.06] text-gray-300 px-3 py-1 rounded-full text-sm font-semibold">
                {categoryLabel}
              </span>
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                {product.name}
              </h1>
              <p className="text-4xl font-black text-[#38BDF8]">
                {formatARS(product.price)}
              </p>
              {!product.isKit && (
                <p className={`mt-2 text-sm font-medium ${isOutOfStock ? 'text-red-400' : 'text-gray-400'}`}>
                  {isOutOfStock ? 'Sin stock' : `Stock disponible: ${product.stock ?? 0}`}
                </p>
              )}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center rounded-lg border border-white/10 bg-[#0B0F14]">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-800 transition"
                    aria-label="Bajar cantidad"
                  >
                    <Minus className="w-5 h-5 text-white" />
                  </button>
                  <span className="px-6 text-white font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxQuantity || isOutOfStock}
                    className="p-3 hover:bg-gray-800 transition disabled:cursor-not-allowed disabled:opacity-45"
                    aria-label="Subir cantidad"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#0EA5E9] text-white font-black py-4 px-8 rounded-lg hover:bg-[#38BDF8] transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-gray-800 pt-6 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-lg bg-white/[0.035] p-3 text-center sm:bg-transparent sm:p-0">
                <p className="text-gray-400 text-sm mb-1">Envío gratis</p>
                <p className="text-white text-xs">Desde $50.000</p>
              </div>
              <div className="rounded-lg bg-white/[0.035] p-3 text-center sm:bg-transparent sm:p-0">
                <p className="text-gray-400 text-sm mb-1">Pago</p>
                <p className="text-white text-xs">Manual</p>
              </div>
              <div className="rounded-lg bg-white/[0.035] p-3 text-center sm:bg-transparent sm:p-0">
                <p className="text-gray-400 text-sm mb-1">Soporte</p>
                <p className="text-white text-xs">Al confirmar</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0B0F14] rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#0EA5E9]/20 p-3 rounded-lg">
                <Info className="w-6 h-6 text-[#0EA5E9]" />
              </div>
              <h3 className="text-xl font-black text-white">Para qué sirve</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {product.whatIsItFor}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#0B0F14] rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#0EA5E9]/20 p-3 rounded-lg">
                <Package className="w-6 h-6 text-[#0EA5E9]" />
              </div>
              <h3 className="text-xl font-black text-white">Cómo usarlo</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {product.howToUse}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#0B0F14] rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#0EA5E9]/20 p-3 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-[#0EA5E9]" />
              </div>
              <h3 className="text-xl font-black text-white">Compra</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Agregalo al carrito, completá tus datos y coordinamos pago y entrega al confirmar.
            </p>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              También puede servirte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/product/${related.slug}`}
                    className="block bg-[#101720] rounded-xl overflow-hidden border border-white/10 hover:border-cyan-300/35 transition-all group"
                  >
                    <div className="relative h-48 overflow-hidden bg-black">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2 group-hover:text-[#38BDF8] transition">
                        {related.name}
                      </h3>
                      <p className="text-xl font-bold text-white">
                        {formatARS(related.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#050607]/95 p-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-400">Precio</p>
            <p className="truncate text-lg font-black text-white">{formatARS(product.price)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0EA5E9] px-5 py-3 text-sm font-black text-white transition hover:bg-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? 'Sin stock' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
