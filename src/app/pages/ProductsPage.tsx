import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { PRODUCT_CATEGORIES, CATEGORY_LABELS, type ProductCategorySlug } from '../../lib/catalog';
import { formatARS } from '../../lib/format';
import { kitAsProduct, kitFromRow, productFromRow } from '../../lib/mappers';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';
import { useCart } from '../context/CartContext';

type CategoryFilter = ProductCategorySlug | 'all';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

const categoryFilters: Array<{ slug: CategoryFilter; name: string }> = [
  { slug: 'all', name: 'Todos' },
  ...PRODUCT_CATEGORIES.map((category) => ({ slug: category.slug, name: category.shortName })),
];

const sortLabels: Record<SortOption, string> = {
  featured: 'Destacados',
  'price-asc': 'Menor precio',
  'price-desc': 'Mayor precio',
  name: 'Nombre',
};

function isAvailable(product: Product) {
  return product.isKit || (product.stock ?? 0) > 0;
}

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortOption>('featured');

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      setError('');

      const [productsResult, kitsResult] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('status', 'active')
          .order('is_best_seller', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase
          .from('kits')
          .select('*')
          .eq('is_active', true)
          .eq('status', 'active')
          .order('is_best_seller', { ascending: false })
          .order('created_at', { ascending: false }),
      ]);

      if (productsResult.error || kitsResult.error) {
        console.error('Error loading catalog:', productsResult.error ?? kitsResult.error);
        setError('No pudimos cargar el catálogo. Probá de nuevo en unos segundos.');
        setLoading(false);
        return;
      }

      setProducts([
        ...(productsResult.data ?? []).map(productFromRow),
        ...(kitsResult.data ?? []).map(kitFromRow).map(kitAsProduct),
      ]);
      setLoading(false);
    }

    loadCatalog();
  }, []);

  const countsByCategory = useMemo(() => {
    return products.reduce<Record<string, number>>((counts, product) => {
      counts.all = (counts.all ?? 0) + 1;
      counts[product.category] = (counts[product.category] ?? 0) + 1;
      return counts;
    }, {});
  }, [products]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query) ||
        CATEGORY_LABELS[product.category]?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);

      const scoreA = Number(a.isBestSeller) * 2 + Number(isAvailable(a));
      const scoreB = Number(b.isBestSeller) * 2 + Number(isAvailable(b));
      return scoreB - scoreA || a.name.localeCompare(b.name);
    });
  }, [category, products, search, sort]);

  const handleAddToCart = (product: Product) => {
    if (!isAvailable(product)) {
      toast.error('Este producto está sin stock.');
      return;
    }

    addToCart(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="min-h-screen bg-[#050607]">
      <section className="border-b border-white/10 bg-[#071018] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#38BDF8]">
            Catálogo
          </p>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Elegí, agregá y comprá.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
                Productos y kits de detailing en una sola pantalla, con búsqueda, filtros y stock visible.
              </p>
            </div>
            <Link
              to="/checkout"
              className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-[#0EA5E9] px-5 text-sm font-black text-white transition hover:bg-[#38BDF8]"
            >
              Ir al checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="sticky top-16 z-20 -mx-4 border-y border-white/10 bg-[#050607]/95 px-4 py-4 backdrop-blur sm:top-[72px] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="relative block">
                <span className="sr-only">Buscar productos</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar shampoo, microfibra, cera..."
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.06] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                />
              </label>

              <label className="flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-slate-300">
                <SlidersHorizontal className="h-4 w-4 text-[#38BDF8]" />
                <span className="sr-only">Ordenar productos</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className="h-full bg-transparent font-bold text-white outline-none"
                >
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value} className="bg-[#0B0F14] text-white">
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto pb-1">
              {categoryFilters.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setCategory(item.slug)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
                    category === item.slug
                      ? 'border-cyan-300 bg-cyan-300 text-[#061018]'
                      : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-cyan-300/40 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span className="ml-2 text-xs opacity-70">{countsByCategory[item.slug] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-[390px] animate-pulse rounded-xl border border-white/10 bg-white/[0.035]" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="my-10 rounded-xl border border-red-400/20 bg-red-500/10 p-6 text-red-100">
              {error}
            </div>
          )}

          {!loading && !error && visibleProducts.length === 0 && (
            <div className="my-10 rounded-xl border border-white/10 bg-[#0B0F14] p-8 text-center">
              <h2 className="text-2xl font-black text-white">No encontramos productos</h2>
              <p className="mt-2 text-slate-400">Probá con otra búsqueda o elegí otra categoría.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
                className="mt-5 rounded-lg bg-white px-5 py-3 text-sm font-black text-[#071018]"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {!loading && !error && visibleProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product, index) => {
                const available = isAvailable(product);

                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.16) }}
                    className="group flex overflow-hidden rounded-xl border border-white/10 bg-[#0B0F14] transition hover:border-cyan-300/35"
                  >
                    <div className="flex w-full flex-col">
                      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-black">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute left-3 top-3 flex gap-2">
                          <span className="rounded-full bg-black/75 px-3 py-1 text-xs font-black uppercase text-slate-200 backdrop-blur">
                            {CATEGORY_LABELS[product.category] ?? product.category}
                          </span>
                          {product.isBestSeller && (
                            <span className="rounded-full bg-[#0EA5E9] px-3 py-1 text-xs font-black uppercase text-white">
                              Más vendido
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col p-4">
                        <Link to={`/product/${product.slug}`} className="block">
                          <h2 className="line-clamp-2 min-h-[44px] text-base font-black leading-snug text-white transition group-hover:text-[#38BDF8]">
                            {product.name}
                          </h2>
                          <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-400">
                            {product.shortDescription}
                          </p>
                        </Link>

                        <div className="mt-4 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-xl font-black text-white">{formatARS(product.price)}</p>
                            <p className={`mt-1 text-xs font-bold ${available ? 'text-emerald-300' : 'text-red-300'}`}>
                              {product.isKit ? 'Kit disponible' : available ? `Stock: ${product.stock}` : 'Sin stock'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={!available}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#0EA5E9] text-white transition hover:bg-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-45"
                            aria-label={`Agregar ${product.name} al carrito`}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
