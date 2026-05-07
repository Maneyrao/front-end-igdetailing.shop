import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, X, ImageIcon, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { type Product, type Kit, type KitItem } from '../../../lib/types';

interface KitFormProps {
  kit?: Kit | null;
  products: Product[];
  onClose: () => void;
  onSave: (kit: Kit) => Promise<boolean | void> | boolean | void;
}

export function KitFormModal({ kit, products, onClose, onSave }: KitFormProps) {
  const isEdit = !!kit;
  const [form, setForm] = useState<Partial<Kit>>(
    kit ?? {
      id: '',
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: 0,
      image: '',
      items: [],
      isBestSeller: false,
      isActive: true,
    }
  );

  const handleChange = (field: keyof Kit, value: unknown) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && typeof value === 'string') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      }
      return updated;
    });
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    setForm(prev => ({
      ...prev,
      items: [...(prev.items || []), { productId: products[0].id, quantity: 1 }]
    }));
  };

  const [saving, setSaving] = useState(false);

  const handleUpdateItem = (index: number, field: keyof KitItem, value: string | number) => {
    setForm(prev => {
      const newItems = [...(prev.items || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleRemoveItem = (index: number) => {
    setForm(prev => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price === undefined) {
      toast.error('Nombre y precio son obligatorios');
      return;
    }
    if (!form.items || form.items.length === 0) {
      toast.error('El kit debe tener al menos un producto');
      return;
    }
    setSaving(true);
    const result = await onSave(form as Kit);
    setSaving(false);
    if (result === false) return;
    onClose();
  };

  const inputClass = 'w-full rounded-lg border border-[#1E2030] bg-[#060608] px-3 py-2 text-sm text-white placeholder-[#374151] focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]/30 transition';
  const labelClass = 'block text-xs font-medium text-[#94A3B8] mb-1.5';

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} className="relative w-full max-w-2xl rounded-2xl border border-[#1E2030] bg-[#0A0A12] shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#1E2030] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9]/10">
                <Package className="h-4 w-4 text-[#0EA5E9]" />
              </div>
              <h2 className="text-base font-semibold text-white">{isEdit ? 'Editar Kit' : 'Nuevo Kit'}</h2>
            </div>
            <button onClick={onClose} className="text-[#64748B] hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre del Kit *</label>
                <input className={inputClass} value={form.name ?? ''} onChange={e => handleChange('name', e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Precio (ARS) *</label>
                <input className={inputClass} type="number" value={form.price ?? ''} onChange={e => handleChange('price', parseFloat(e.target.value))} required />
              </div>
            </div>

            <div>
              <label className={labelClass}>URL de imagen</label>
              <div className="flex gap-2">
                <input className={`${inputClass} flex-1`} value={form.image ?? ''} onChange={e => handleChange('image', e.target.value)} />
                {form.image ? <img src={form.image} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E2030] bg-[#111120]"><ImageIcon className="h-4 w-4 text-[#374151]" /></div>}
              </div>
            </div>

            <div>
              <label className={labelClass}>Descripción corta</label>
              <input className={inputClass} value={form.shortDescription ?? ''} onChange={e => handleChange('shortDescription', e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Descripción completa</label>
              <textarea className={`${inputClass} resize-none`} rows={3} value={form.description ?? ''} onChange={e => handleChange('description', e.target.value)} />
            </div>

            {/* Productos del Kit */}
            <div className="pt-2 border-t border-[#1E2030]">
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass}>Productos incluidos</label>
                <button type="button" onClick={handleAddItem} className="flex items-center gap-1 text-xs text-[#0EA5E9] hover:text-[#38BDF8]">
                  <Plus className="h-3 w-3" /> Agregar producto
                </button>
              </div>
              
              <div className="space-y-2">
                {(form.items || []).map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      className={`${inputClass} flex-1`}
                      value={item.productId}
                      onChange={e => handleUpdateItem(index, 'productId', e.target.value)}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - ${p.price.toLocaleString('es-AR')}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      className={`${inputClass} w-20`}
                      value={item.quantity}
                      onChange={e => handleUpdateItem(index, 'quantity', parseInt(e.target.value))}
                    />
                    <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-[#64748B] hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(!form.items || form.items.length === 0) && (
                  <p className="text-xs text-[#64748B] text-center py-2">No hay productos en este kit.</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 cursor-pointer select-none pt-1" onClick={() => handleChange('isBestSeller', !form.isBestSeller)}>
              <div className={`relative h-5 w-9 rounded-full transition-colors ${form.isBestSeller ? 'bg-[#0EA5E9]' : 'bg-[#1E2030]'}`}>
                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isBestSeller ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-xs text-[#94A3B8]">Más vendido</span>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#1E2030] pt-4">
              <button type="button" onClick={onClose} className="rounded-lg border border-[#1E2030] px-4 py-2 text-sm text-[#94A3B8] hover:text-white transition">Cancelar</button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#0EA5E9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#38BDF8] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Guardando...' : isEdit ? 'Guardar' : 'Crear Kit'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
