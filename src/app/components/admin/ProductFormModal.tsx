import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, X, ChevronDown, ImageIcon, Save } from 'lucide-react';
import { toast } from 'sonner';
import { type Product } from '../../../lib/types';

export const CATEGORY_LABELS: Record<string, string> = {
  wash: 'Lavado',
  interior: 'Interior',
  protection: 'Protección',
  accessories: 'Accesorios',
  kits: 'Kits',
};

export const CATEGORY_COLORS: Record<string, string> = {
  wash: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  interior: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  protection: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  accessories: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  kits: 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20',
};

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => Promise<boolean | void> | boolean | void;
}

export function ProductFormModal({ product, onClose, onSave }: ProductFormProps) {
  const isEdit = !!product;
  const [form, setForm] = useState<Partial<Product>>(
    product ?? {
      id: '',
      name: '',
      slug: '',
      category: 'wash',
      price: 0,
      stock: 0,
      status: 'active',
      image: '',
      shortDescription: '',
      description: '',
      whatIsItFor: '',
      howToUse: '',
      isBestSeller: false,
    }
  );

  const handleChange = (field: keyof Product, value: unknown) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && typeof value === 'string') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
      }
      return updated;
    });
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price === undefined) {
      toast.error('Nombre y precio son obligatorios');
      return;
    }
    setSaving(true);
    const result = await onSave(form as Product);
    setSaving(false);
    if (result === false) return;
    onClose();
  };

  const inputClass =
    'w-full rounded-lg border border-[#1E2030] bg-[#060608] px-3 py-2 text-sm text-white placeholder-[#374151] focus:border-[#0EA5E9] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]/30 transition';
  const labelClass = 'block text-xs font-medium text-[#94A3B8] mb-1.5';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-2xl border border-[#1E2030] bg-[#0A0A12] shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E2030] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9]/10">
                <Package className="h-4 w-4 text-[#0EA5E9]" />
              </div>
              <h2 className="text-base font-semibold text-white">
                {isEdit ? 'Editar producto' : 'Nuevo producto'}
              </h2>
            </div>
            <button onClick={onClose} className="text-[#64748B] hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nombre *</label>
                <input
                  className={inputClass}
                  value={form.name ?? ''}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Shampoo pH neutro"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Precio (ARS) *</label>
                <input
                  className={inputClass}
                  type="number"
                  step="1"
                  min="0"
                  value={form.price ?? ''}
                  onChange={e => handleChange('price', parseFloat(e.target.value))}
                  placeholder="29990"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock</label>
                <input
                  className={inputClass}
                  type="number"
                  step="1"
                  min="0"
                  value={form.stock ?? 0}
                  onChange={e => handleChange('stock', parseInt(e.target.value || '0', 10))}
                  placeholder="20"
                />
              </div>
              <div>
                <label className={labelClass}>Slug (URL)</label>
                <input
                  className={inputClass}
                  value={form.slug ?? ''}
                  onChange={e => handleChange('slug', e.target.value)}
                  placeholder="shampoo-ph-neutro"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Categoría</label>
                <div className="relative">
                  <select
                    className={`${inputClass} appearance-none pr-8`}
                    value={form.category ?? 'wash'}
                    onChange={e => handleChange('category', e.target.value as Product['category'])}
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Estado</label>
                <div className="relative">
                  <select
                    className={`${inputClass} appearance-none pr-8`}
                    value={form.status ?? 'active'}
                    onChange={e => handleChange('status', e.target.value as Product['status'])}
                  >
                    <option value="active">Activo</option>
                    <option value="paused">Pausado</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>URL de imagen</label>
              <div className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={form.image ?? ''}
                  onChange={e => handleChange('image', e.target.value)}
                  placeholder="https://..."
                />
                {form.image ? (
                  <img src={form.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-[#1E2030]" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E2030] bg-[#111120]">
                    <ImageIcon className="h-4 w-4 text-[#374151]" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>Descripción corta</label>
              <input
                className={inputClass}
                value={form.shortDescription ?? ''}
                onChange={e => handleChange('shortDescription', e.target.value)}
                placeholder="Frase corta que aparece en la tarjeta del producto"
              />
            </div>

            <div>
              <label className={labelClass}>Descripción completa</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                value={form.description ?? ''}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>¿Para qué sirve?</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={form.whatIsItFor ?? ''}
                onChange={e => handleChange('whatIsItFor', e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>¿Cómo se usa?</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={form.howToUse ?? ''}
                onChange={e => handleChange('howToUse', e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 cursor-pointer select-none pt-1" onClick={() => handleChange('isBestSeller', !form.isBestSeller)}>
              <div className={`relative h-5 w-9 rounded-full transition-colors ${form.isBestSeller ? 'bg-[#0EA5E9]' : 'bg-[#1E2030]'}`}>
                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isBestSeller ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-xs text-[#94A3B8]">Más vendido</span>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#1E2030] pt-4">
              <button type="button" onClick={onClose} className="rounded-lg border border-[#1E2030] px-4 py-2 text-sm text-[#94A3B8] hover:border-[#2A2A3E] hover:text-white transition">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#0EA5E9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#38BDF8] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
