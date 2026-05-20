import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Minus, Package, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { supabase } from '../../../lib/supabase';
import { productFromRow } from '../../../lib/mappers';
import type { Product } from '../../../lib/types';

const LOW_STOCK_THRESHOLD = 5;

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
        Sin stock
      </span>
    );
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
        Stock bajo
      </span>
    );
  }

  if (stock <= 10) {
    return (
      <span className="inline-flex items-center rounded-full border border-[#64748B]/20 bg-[#64748B]/10 px-2 py-0.5 text-[10px] font-medium text-[#94A3B8]">
        Moderado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
      OK
    </span>
  );
}

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('stock', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      toast.error(`Error cargando inventario: ${error.message}`);
      setProducts([]);
    } else {
      setProducts((data ?? []).map(productFromRow));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const stats = useMemo(() => {
    const outOfStock = products.filter(product => (product.stock ?? 0) === 0);
    const lowStock = products.filter(product => {
      const stock = product.stock ?? 0;
      return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
    });

    return {
      outOfStock,
      lowStock,
      totalUnits: products.reduce((sum, product) => sum + (product.stock ?? 0), 0),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    const visible = searchLower
      ? products.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        )
      : products;

    return [...visible].sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
  }, [products, search]);

  const handleUpdateStock = async (product: Product, nextStock: number) => {
    const stock = Math.max(0, nextStock);
    const previous = products;

    setUpdatingId(product.id);
    setProducts(current =>
      current.map(item => item.id === product.id ? { ...item, stock } : item)
    );

    const { error } = await supabase
      .from('products')
      .update({ stock })
      .eq('id', product.id);

    setUpdatingId(null);

    if (error) {
      setProducts(previous);
      toast.error(`No se pudo actualizar stock: ${error.message}`);
    } else {
      toast.success('Stock actualizado');
    }
  };

  return (
    <>
      <AdminTopbar
        title="Inventario"
        subtitle={loading ? 'Cargando stock...' : `${products.length} productos controlados`}
      />

      <main className="p-4 lg:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className={`rounded-xl border p-5 ${stats.outOfStock.length > 0 ? 'border-red-500/25 bg-red-500/5' : 'border-[#1E2030] bg-[#0A0A12]'}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">Sin stock</p>
              <AlertTriangle className={`h-5 w-5 ${stats.outOfStock.length > 0 ? 'text-red-400' : 'text-[#374151]'}`} />
            </div>
            <p className={`mt-3 text-3xl font-bold ${stats.outOfStock.length > 0 ? 'text-red-400' : 'text-white'}`}>
              {stats.outOfStock.length}
            </p>
            <p className="mt-1 text-xs text-[#94A3B8]">Productos agotados</p>
          </div>

          <div className={`rounded-xl border p-5 ${stats.lowStock.length > 0 ? 'border-amber-500/25 bg-amber-500/5' : 'border-[#1E2030] bg-[#0A0A12]'}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">Stock bajo</p>
              <AlertTriangle className={`h-5 w-5 ${stats.lowStock.length > 0 ? 'text-amber-400' : 'text-[#374151]'}`} />
            </div>
            <p className={`mt-3 text-3xl font-bold ${stats.lowStock.length > 0 ? 'text-amber-400' : 'text-white'}`}>
              {stats.lowStock.length}
            </p>
            <p className="mt-1 text-xs text-[#94A3B8]">Productos con 1 a {LOW_STOCK_THRESHOLD} unidades</p>
          </div>

          <div className="rounded-xl border border-[#1E2030] bg-[#0A0A12] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">Unidades totales</p>
              <Package className="h-5 w-5 text-[#0EA5E9]" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{stats.totalUnits}</p>
            <p className="mt-1 text-xs text-[#94A3B8]">Stock disponible para productos sueltos</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#374151]" />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            className="w-full rounded-lg border border-[#1E2030] bg-[#0A0A12] py-2 pl-9 pr-4 text-sm text-white placeholder-[#374151] transition focus:border-[#0EA5E9] focus:outline-none"
            placeholder="Buscar producto..."
          />
        </div>

        <div className="rounded-xl border border-[#1E2030] bg-[#0A0A12] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2030]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden md:table-cell">Precio</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#64748B] uppercase tracking-wide">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden sm:table-cell">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wide">Ajuste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2030]">
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#64748B]">
                      Cargando inventario...
                    </td>
                  </tr>
                )}

                {!loading && filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#64748B]">
                      No se encontraron productos
                    </td>
                  </tr>
                )}

                {!loading && filteredProducts.map(product => {
                  const stock = product.stock ?? 0;
                  const isAlert = stock <= LOW_STOCK_THRESHOLD;

                  return (
                    <tr key={product.id} className={`transition-colors hover:bg-[#111120] ${isAlert ? 'bg-amber-500/[0.03]' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-lg border border-[#1E2030] bg-[#060608]">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-4 w-4 text-[#374151]" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-white max-w-[220px]">{product.name}</p>
                            <p className="truncate text-[11px] text-[#64748B] max-w-[220px]">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs font-semibold text-white">
                        {formatARS(product.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-lg font-bold ${stock === 0 ? 'text-red-400' : stock <= LOW_STOCK_THRESHOLD ? 'text-amber-400' : 'text-white'}`}>
                          {stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <StockBadge stock={stock} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStock(product, stock - 1)}
                            disabled={stock === 0 || updatingId === product.id}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E2030] text-[#94A3B8] transition hover:border-[#2A2A3E] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Reducir stock"
                            title="Reducir stock"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStock(product, stock + 1)}
                            disabled={updatingId === product.id}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E2030] text-[#94A3B8] transition hover:border-[#0EA5E9] hover:text-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Aumentar stock"
                            title="Aumentar stock"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
