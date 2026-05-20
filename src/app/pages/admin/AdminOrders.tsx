import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  CheckCircle2,
  PackageCheck,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import type { Order, OrderStatus, PaymentStatus } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';
import { orderFromRow } from '../../../lib/mappers';

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20',
};

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const STATUS_ORDER: OrderStatus[] = ['new', 'contacted', 'paid', 'shipped', 'delivered'];

// ─── Order Detail Modal ────────────────────────────────────────────────────────

function OrderDetailModal({
  order,
  onClose,
  onMarkPaid,
  onMarkShipped,
  onMarkDelivered,
}: {
  order: Order;
  onClose: () => void;
  onMarkPaid: (id: string) => Promise<void> | void;
  onMarkShipped: (id: string) => Promise<void> | void;
  onMarkDelivered: (id: string) => Promise<void> | void;
}) {
  const waLink = `https://wa.me/${(order.customer_phone ?? '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.customer_name}, te contactamos por tu orden ${order.order_number}`)}`;

  return (
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
        className="relative w-full max-w-lg rounded-2xl border border-[#1E2030] bg-[#0A0A12] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2030] px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#0EA5E9]">{order.order_number}</span>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[order.order_status]}`}>
                {STATUS_LABELS[order.order_status]}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {new Date(order.created_at).toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <button onClick={onClose} className="text-[#64748B] hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status timeline */}
          <div>
            <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wide mb-3">Estado del pedido</p>
            <div className="flex items-center gap-1">
              {STATUS_ORDER.map((s, i) => {
                const currentIdx = STATUS_ORDER.indexOf(order.order_status);
                const isDone = i <= currentIdx;
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className={`h-2 w-2 rounded-full flex-none transition-colors ${isDone ? 'bg-[#0EA5E9]' : 'bg-[#1E2030]'}`} />
                    {i < STATUS_ORDER.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 transition-colors ${isDone && i < currentIdx ? 'bg-[#0EA5E9]' : 'bg-[#1E2030]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1.5">
              {STATUS_ORDER.map((s, i) => {
                const currentIdx = STATUS_ORDER.indexOf(order.order_status);
                return (
                  <span key={s} className={`text-[9px] ${i <= currentIdx ? 'text-[#0EA5E9]' : 'text-[#374151]'}`}>
                    {STATUS_LABELS[s]}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-xl border border-[#1E2030] bg-[#060608] p-4 space-y-2.5">
            <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wide">Cliente</p>
            <p className="text-sm font-semibold text-white">{order.customer_name}</p>
            <div className="space-y-1.5">
              <a href={`mailto:${order.customer_email}`} className="flex items-center gap-2 text-xs text-[#94A3B8] hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5 text-[#0EA5E9]" />
                {order.customer_email}
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#94A3B8] hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5 text-[#0EA5E9]" />
                {order.customer_phone}
              </a>
              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                <MapPin className="h-3.5 w-3.5 text-[#0EA5E9]" />
                {order.shipping_address}, {order.shipping_city}
              </div>
            </div>
            {order.notes && (
              <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-2">
                <p className="text-[10px] text-amber-400 font-medium mb-0.5">Nota del cliente</p>
                <p className="text-xs text-[#94A3B8]">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wide mb-3">Productos</p>
            <div className="space-y-2">
              {(order.items ?? []).map(item => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-[#1E2030] bg-[#060608] p-2.5">
                  {item.product_image && (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="h-10 w-10 rounded-lg object-cover border border-[#1E2030] shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{item.product_name}</p>
                    <p className="text-[11px] text-[#64748B]">x{item.quantity} · ${item.unit_price.toLocaleString('es-AR')} c/u</p>
                  </div>
                  <p className="text-xs font-semibold text-white shrink-0">
                    ${(item.quantity * item.unit_price).toLocaleString('es-AR')}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mt-3 border-t border-[#1E2030] pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B]">Pago:</span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${PAYMENT_COLORS[order.payment_status]}`}>
                  {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
              <span className="text-base font-bold text-white">${order.total_amount.toLocaleString('es-AR')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 border-t border-[#1E2030] pt-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[#1E2030] px-3 py-1.5 text-xs text-[#94A3B8] hover:border-[#25D366] hover:text-[#25D366] transition"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            {order.payment_status === 'pending' && (
              <button
                onClick={() => { onMarkPaid(order.id); onClose(); }}
                className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Marcar pagado
              </button>
            )}
            {order.payment_status === 'paid' && order.order_status === 'paid' && (
              <button
                onClick={() => { onMarkShipped(order.id); onClose(); }}
                className="flex items-center gap-2 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-xs text-purple-400 hover:bg-purple-500/20 transition"
              >
                <PackageCheck className="h-3.5 w-3.5" />
                Marcar enviado
              </button>
            )}
            {order.order_status === 'shipped' && (
              <button
                onClick={() => { onMarkDelivered(order.id); onClose(); }}
                className="flex items-center gap-2 rounded-lg bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 px-3 py-1.5 text-xs text-[#0EA5E9] hover:bg-[#0EA5E9]/20 transition"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Marcar entregado
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ─── Fetch on mount ─────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(`Error cargando órdenes: ${error.message}`);
      } else {
        setOrders((data ?? []).map(orderFromRow));
      }
    }
    loadOrders();
  }, []);

  // ─── Derived ────────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return orders
      .filter(o => {
        const matchSearch = !search ||
          (o.customer_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
          o.order_number.toLowerCase().includes(search.toLowerCase()) ||
          (o.customer_email ?? '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || o.order_status === filterStatus;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, search, filterStatus]);

  // ─── Update helper ───────────────────────────────────────────────────────────

  const updateOrder = async (id: string, patch: Partial<Order>) => {
    // Optimistic local update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
    setSelectedOrder(prev => prev?.id === id ? { ...prev, ...patch } : prev);

    const { error } = await supabase.from('orders').update(patch).eq('id', id);
    if (error) {
      toast.error(`Error actualizando orden: ${error.message}`);
      // Revert: refetch
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });
      if (data) setOrders(data.map(orderFromRow));
      return false;
    }
    return true;
  };

  const handleMarkPaid = async (id: string) => {
    const previousOrders = orders;
    const previousSelectedOrder = selectedOrder;

    setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status: 'paid', order_status: 'paid' } : o));
    setSelectedOrder(prev => prev?.id === id ? { ...prev, payment_status: 'paid', order_status: 'paid' } : prev);

    const { error } = await supabase.rpc('mark_order_paid', { target_order_id: id });

    if (error) {
      setOrders(previousOrders);
      setSelectedOrder(previousSelectedOrder);
      toast.error(`No se pudo marcar como pagada: ${error.message}`);
    } else {
      toast.success('Orden marcada como pagada');
    }
  };

  const handleMarkShipped = async (id: string) => {
    if (await updateOrder(id, { order_status: 'shipped' })) {
      toast.success('Orden marcada como enviada');
    }
  };

  const handleMarkDelivered = async (id: string) => {
    if (await updateOrder(id, { order_status: 'delivered' })) {
      toast.success('Orden marcada como entregada');
    }
  };

  // Stats
  const newCount = orders.filter(o => o.order_status === 'new').length;
  const pendingPayment = orders.filter(o => o.payment_status === 'pending').length;

  return (
    <>
      <AdminTopbar
        title="Órdenes"
        subtitle={`${orders.length} órdenes en total`}
      />

      <main className="p-4 lg:p-6 space-y-4">
        {/* Quick stats */}
        {(newCount > 0 || pendingPayment > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3"
          >
            {newCount > 0 && (
              <button
                onClick={() => setFilterStatus('new')}
                className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/15 transition"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                {newCount} orden{newCount !== 1 ? 'es' : ''} nueva{newCount !== 1 ? 's' : ''}
              </button>
            )}
            {pendingPayment > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {pendingPayment} pago{pendingPayment !== 1 ? 's' : ''} pendiente{pendingPayment !== 1 ? 's' : ''}
              </div>
            )}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#374151]" />
            <input
              className="w-full rounded-lg border border-[#1E2030] bg-[#0A0A12] pl-9 pr-4 py-2 text-sm text-white placeholder-[#374151] focus:border-[#0EA5E9] focus:outline-none transition"
              placeholder="Buscar por cliente, email o #orden..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none rounded-lg border border-[#1E2030] bg-[#0A0A12] pl-4 pr-8 py-2 text-sm text-white focus:border-[#0EA5E9] focus:outline-none transition w-full sm:w-44"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            >
              <option value="all">Todos los estados</option>
              {STATUS_ORDER.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-[#1E2030] bg-[#0A0A12] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2030]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide"># Orden</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden sm:table-cell">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden md:table-cell">Pago</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2030]">
                {filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-[#111120] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-[#0EA5E9]">{order.order_number}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-medium text-white text-xs">{order.customer_name}</p>
                        <p className="text-[#64748B] text-[11px] hidden sm:block">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="font-semibold text-white">${order.total_amount.toLocaleString('es-AR')}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[order.order_status]}`}>
                        {STATUS_LABELS[order.order_status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${PAYMENT_COLORS[order.payment_status]}`}>
                        {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-[#64748B]">
                        {new Date(order.created_at).toLocaleDateString('es-AR', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <ShoppingCart className="h-10 w-10 text-[#1E2030] mx-auto mb-3" />
                <p className="text-sm text-[#64748B]">No se encontraron órdenes</p>
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-xs text-[#374151] text-right">
          {filtered.length} de {orders.length} órdenes · Click en una fila para ver detalle
        </p>
      </main>

      {/* Order detail modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            key={selectedOrder.id}
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onMarkPaid={handleMarkPaid}
            onMarkShipped={handleMarkShipped}
            onMarkDelivered={handleMarkDelivered}
          />
        )}
      </AnimatePresence>
    </>
  );
}
