import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { supabase } from '../../lib/supabase';
import { kitAsProduct, kitFromRow, productFromRow } from '../../lib/mappers';
import type { Product } from '../../lib/types';
import { formatARS } from '../../lib/format';
import { BackLink } from '../components/BackLink';
import { CATEGORY_INFO, CATEGORY_LABELS } from '../../lib/catalog';

export default function CategoryPage() {
  const { category } = useParams();
  const { addToCart } = useCart();
  const info = category ? CATEGORY_INFO[category] : null;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (!category || !CATEGORY_INFO[category]) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      if (category === 'kits') {
        const { data, error } = await supabase
          .from('kits')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading kits:', error);
          setProducts([]);
        } else {
          setProducts((data ?? []).map(row => kitAsProduct(kitFromRow(row))));
        }
      } else {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('category', category)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading products:', error);
          setProducts([]);
        } else {
          setProducts((data ?? []).map(productFromRow));
        }
      }

      setLoading(false);
    }

    loadProducts();
  }, [category]);

  if (!info) {
    return (
      <div className="min-h-screen bg-[#050607] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Categoría no encontrada</h1>
          <Link to="/productos" className="text-[#0EA5E9] hover:text-[#38BDF8]">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isKit && (product.stock ?? 0) <= 0) return;
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="min-h-screen bg-[#050607]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackLink fallback="/productos" label="Volver a productos" className="mb-8" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F14] p-6 sm:p-8 md:p-10"
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#38BDF8]">
            Catálogo
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            {info.title}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            {info.description}
          </p>
          {!loading && (
            <p className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-semibold text-slate-300">
              {products.length} {products.length === 1 ? 'producto disponible' : 'productos disponibles'}
            </p>
          )}
        </motion.div>

        {loading && (
          <div className="py-16 text-center">
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-[#0B0F14] py-16 text-center">
            <p className="text-gray-400">Todavía no hay productos disponibles en esta categoría.</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const isOutOfStock = !product.isKit && (product.stock ?? 0) <= 0;
              return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#101720] transition-all hover:border-cyan-300/35 hover:shadow-lg hover:shadow-cyan-950/20">
                  <Link to={`/product/${product.slug}`} className="relative block h-56 overflow-hidden bg-black">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isKit && (
                      <div className="absolute top-3 left-3 bg-[#0EA5E9] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                        Kit
                      </div>
                    )}
                    {product.isBestSeller && !product.isKit && (
                      <div className="absolute top-3 left-3 bg-amber-300 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                        Más vendido
                      </div>
                    )}
                    {!product.isKit && (
                      <div className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                        isOutOfStock
                          ? 'bg-red-500/15 text-red-200 ring-1 ring-red-400/25'
                          : 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/20'
                      }`}>
                        {isOutOfStock ? 'Sin stock' : `${product.stock ?? 0} u.`}
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col">
                    <Link to={`/product/${product.slug}`} className="block">
                      <h3 className="text-white font-black text-lg mb-2 group-hover:text-[#38BDF8] transition">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </Link>

                    <div className="mb-4 mt-auto">
                      <span className="inline-block rounded bg-white/[0.06] px-2 py-1 text-xs font-semibold text-slate-300">
                        {product.isKit ? 'Kit completo' : CATEGORY_LABELS[product.category] ?? product.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-white">
                        {formatARS(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={isOutOfStock}
                        className="inline-flex h-11 w-11 items-center justify-center bg-[#0EA5E9] text-white rounded-lg hover:bg-[#38BDF8] transition disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Agregar al carrito"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </article>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
