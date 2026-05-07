import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, Edit2, Trash2, Star, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import type { Product, Kit } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';
import { productFromRow, productToRow, kitFromRow, kitToRow } from '../../../lib/mappers';
import { ProductFormModal, CATEGORY_LABELS, CATEGORY_COLORS } from '../../components/admin/ProductFormModal';
import { KitFormModal } from '../../components/admin/KitFormModal';
import { DeleteModal } from '../../components/admin/DeleteModal';

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState<'products' | 'kits'>('products');
  const [productList, setProductList] = useState<Product[]>([]);
  const [kitList, setKitList] = useState<Kit[]>([]);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [editingKit, setEditingKit] = useState<Kit | null | undefined>(undefined);
  const [deletingKit, setDeletingKit] = useState<Kit | null>(null);

  // ─── Fetch on mount ───────────────────────────────────────────────────────

  useEffect(() => {
    async function loadData() {
      const [{ data: prodData, error: prodErr }, { data: kitData, error: kitErr }] =
        await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('kits').select('*').order('created_at', { ascending: false }),
        ]);

      if (prodErr) toast.error(`Error cargando productos: ${prodErr.message}`);
      else setProductList((prodData ?? []).map(productFromRow));

      if (kitErr) toast.error(`Error cargando kits: ${kitErr.message}`);
      else setKitList((kitData ?? []).map(kitFromRow));
    }
    loadData();
  }, []);

  // ─── Derived ─────────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    return productList.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'all' || p.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [productList, search, filterCategory]);

  const filteredKits = useMemo(() => {
    return kitList.filter(k => !search || k.name.toLowerCase().includes(search.toLowerCase()));
  }, [kitList, search]);

  // ─── Product handlers ─────────────────────────────────────────────────────

  const handleSaveProduct = async (product: Product) => {
    try {
      const isNew = !product.id;
      if (isNew) {
        const { data, error } = await supabase
          .from('products')
          .insert(productToRow(product))
          .select()
          .single();
        if (error) throw error;
        setProductList(prev => [productFromRow(data), ...prev]);
      } else {
        const { data, error } = await supabase
          .from('products')
          .update(productToRow(product))
          .eq('id', product.id)
          .select()
          .single();
        if (error) throw error;
        setProductList(prev => prev.map(p => p.id === product.id ? productFromRow(data) : p));
      }
      toast.success(isNew ? 'Producto creado' : 'Producto actualizado');
      return true;
    } catch (err: unknown) {
      toast.error(`Error guardando producto: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProductList(prev => prev.filter(p => p.id !== id));
      toast.success('Producto eliminado');
    } catch (err: unknown) {
      toast.error(`Error eliminando producto: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleToggleProductBestSeller = async (id: string, newValue: boolean) => {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, isBestSeller: newValue } : p));
    const { error } = await supabase.from('products').update({ is_best_seller: newValue }).eq('id', id);
    if (error) {
      setProductList(prev => prev.map(p => p.id === id ? { ...p, isBestSeller: !newValue } : p));
      toast.error(`Error actualizando: ${error.message}`);
    }
  };

  // ─── Kit handlers ─────────────────────────────────────────────────────────

  const handleSaveKit = async (kit: Kit) => {
    try {
      const isNew = !kit.id;
      if (isNew) {
        const { data, error } = await supabase
          .from('kits')
          .insert(kitToRow(kit))
          .select()
          .single();
        if (error) throw error;
        setKitList(prev => [kitFromRow(data), ...prev]);
      } else {
        const { data, error } = await supabase
          .from('kits')
          .update(kitToRow(kit))
          .eq('id', kit.id)
          .select()
          .single();
        if (error) throw error;
        setKitList(prev => prev.map(k => k.id === kit.id ? kitFromRow(data) : k));
      }
      toast.success(isNew ? 'Kit creado' : 'Kit actualizado');
      return true;
    } catch (err: unknown) {
      toast.error(`Error guardando kit: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  };

  const handleDeleteKit = async (id: string) => {
    try {
      const { error } = await supabase.from('kits').delete().eq('id', id);
      if (error) throw error;
      setKitList(prev => prev.filter(k => k.id !== id));
      toast.success('Kit eliminado');
    } catch (err: unknown) {
      toast.error(`Error eliminando kit: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleToggleKitBestSeller = async (id: string, newValue: boolean) => {
    setKitList(prev => prev.map(k => k.id === id ? { ...k, isBestSeller: newValue } : k));
    const { error } = await supabase.from('kits').update({ is_best_seller: newValue }).eq('id', id);
    if (error) {
      setKitList(prev => prev.map(k => k.id === id ? { ...k, isBestSeller: !newValue } : k));
      toast.error(`Error actualizando: ${error.message}`);
    }
  };

  return (
    <>
      <AdminTopbar
        title="Catálogo"
        subtitle={`${productList.length} productos, ${kitList.length} kits`}
        action={
          <button
            onClick={() => activeTab === 'products' ? setEditingProduct(null) : setEditingKit(null)}
            className="flex items-center gap-2 rounded-lg bg-[#0EA5E9] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#38BDF8] transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Nuevo {activeTab === 'products' ? 'producto' : 'kit'}
          </button>
        }
      />

      <main className="p-4 lg:p-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#1E2030] pb-2">
          <button
            className={`text-sm font-medium transition-colors pb-2 -mb-[9px] ${activeTab === 'products' ? 'text-white border-b-2 border-[#0EA5E9]' : 'text-[#64748B] hover:text-white'}`}
            onClick={() => setActiveTab('products')}
          >
            Productos sueltos
          </button>
          <button
            className={`text-sm font-medium transition-colors pb-2 -mb-[9px] ${activeTab === 'kits' ? 'text-white border-b-2 border-[#0EA5E9]' : 'text-[#64748B] hover:text-white'}`}
            onClick={() => setActiveTab('kits')}
          >
            Armado de Kits
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#374151]" />
            <input
              className="w-full rounded-lg border border-[#1E2030] bg-[#0A0A12] pl-9 pr-4 py-2 text-sm text-white placeholder-[#374151] focus:border-[#0EA5E9] focus:outline-none transition"
              placeholder={`Buscar ${activeTab === 'products' ? 'producto' : 'kit'}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {activeTab === 'products' && (
            <div className="relative flex items-center gap-1.5">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#374151] pointer-events-none" />
              <select
                className="appearance-none rounded-lg border border-[#1E2030] bg-[#0A0A12] pl-8 pr-8 py-2 text-sm text-white focus:border-[#0EA5E9] focus:outline-none transition w-full sm:w-44"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-[#1E2030] bg-[#0A0A12] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2030]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide">{activeTab === 'products' ? 'Producto' : 'Kit'}</th>
                  {activeTab === 'products' && <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden md:table-cell">Categoría</th>}
                  {activeTab === 'kits' && <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden md:table-cell">Items</th>}
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide">Precio</th>
                  {activeTab === 'products' && <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden lg:table-cell">Stock</th>}
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden lg:table-cell">Más vendido</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2030]">
                {activeTab === 'products' ? (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-[#111120] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-[#1E2030] shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-white text-xs truncate max-w-[200px]">{product.name}</p>
                            <p className="text-[#64748B] text-[11px] truncate max-w-[200px]">{product.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[product.category]}`}>
                          {CATEGORY_LABELS[product.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3"><span className="font-semibold text-white">${product.price.toLocaleString('es-AR')}</span></td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`text-xs font-medium ${(product.stock ?? 0) > 0 ? 'text-[#94A3B8]' : 'text-red-400'}`}>
                          {product.stock ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <button
                          onClick={() => handleToggleProductBestSeller(product.id, !product.isBestSeller)}
                          className={`transition-colors ${product.isBestSeller ? 'text-amber-400' : 'text-[#374151] hover:text-amber-400'}`}
                        >
                          <Star className={`h-4 w-4 ${product.isBestSeller ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditingProduct(product)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#1E2030] hover:text-white transition"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setDeletingProduct(product)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#64748B] hover:bg-red-500/10 hover:text-red-400 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredKits.map(kit => (
                    <tr key={kit.id} className="hover:bg-[#111120] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={kit.image} alt={kit.name} className="h-10 w-10 rounded-lg object-cover border border-[#1E2030] shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-white text-xs truncate max-w-[200px]">{kit.name}</p>
                            <p className="text-[#64748B] text-[11px] truncate max-w-[200px]">{kit.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-[#94A3B8] text-xs">{kit.items.length} prod.</td>
                      <td className="px-4 py-3"><span className="font-semibold text-white">${kit.price.toLocaleString('es-AR')}</span></td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <button
                          onClick={() => handleToggleKitBestSeller(kit.id, !kit.isBestSeller)}
                          className={`transition-colors ${kit.isBestSeller ? 'text-amber-400' : 'text-[#374151] hover:text-amber-400'}`}
                        >
                          <Star className={`h-4 w-4 ${kit.isBestSeller ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditingKit(kit)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#1E2030] hover:text-white transition"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setDeletingKit(kit)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#64748B] hover:bg-red-500/10 hover:text-red-400 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {editingProduct !== undefined && <ProductFormModal product={editingProduct} onClose={() => setEditingProduct(undefined)} onSave={handleSaveProduct} />}
        {deletingProduct && <DeleteModal title="Eliminar producto" message={`¿Seguro que querés eliminar "${deletingProduct.name}"?`} onConfirm={() => handleDeleteProduct(deletingProduct.id)} onClose={() => setDeletingProduct(null)} />}

        {editingKit !== undefined && <KitFormModal kit={editingKit} products={productList} onClose={() => setEditingKit(undefined)} onSave={handleSaveKit} />}
        {deletingKit && <DeleteModal title="Eliminar kit" message={`¿Seguro que querés eliminar "${deletingKit.name}"?`} onConfirm={() => handleDeleteKit(deletingKit.id)} onClose={() => setDeletingKit(null)} />}
      </AnimatePresence>
    </>
  );
}
