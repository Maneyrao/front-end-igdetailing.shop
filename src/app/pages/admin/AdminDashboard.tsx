import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Truck,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import type { Order, OrderStatus, PaymentStatus } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';
import { orderFromRow } from '../../../lib/mappers';

// ─── Status helpers ───────────────────────────────────────────────────────────

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

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  delay?: number;
}

function KPICard({ title, value, subtitle, icon: Icon, iconColor, iconBg, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border border-[#1E2030] bg-[#0A0A12] p-5 hover:border-[#2A2A3E] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">{subtitle}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Recent orders table ───────────────────────────────────────────────────────

function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="rounded-xl border border-[#1E2030] bg-[#0A0A12] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2030]">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#0EA5E9]" />
          <h2 className="text-sm font-semibold text-white">Órdenes recientes</h2>
        </div>
        <Link
          to="/admin/orders"
          className="flex items-center gap-1 text-xs text-[#0EA5E9] hover:text-[#38BDF8] transition-colors"
        >
          Ver todas <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E2030]">
              <th className="px-5 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide">Orden</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide">Cliente</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden md:table-cell">Total</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide">Estado</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wide hidden lg:table-cell">Pago</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2030]">
            {orders.map((order, i) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="hover:bg-[#111120] transition-colors"
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs text-[#0EA5E9]">{order.order_number}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div>
                    <p className="font-medium text-white text-xs">{order.customer_name}</p>
                    <p className="text-[#64748B] text-[11px]">{order.customer_email}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <span className="font-semibold text-white">${order.total_amount.toLocaleString('es-AR')}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[order.order_status]}`}>
                    {STATUS_LABELS[order.order_status]}
                  </span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${PAYMENT_COLORS[order.payment_status]}`}>
                    {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="py-12 text-center text-[#64748B] text-sm">
          No hay órdenes recientes
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeCatalogItems, setActiveCatalogItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const [ordersResult, productsResult, kitsResult] = await Promise.all([
        supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false }),
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase
          .from('kits')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
      ]);

      if (ordersResult.error) {
        toast.error(`Error cargando dashboard: ${ordersResult.error.message}`);
        setOrders([]);
      } else {
        setOrders((ordersResult.data ?? []).map(orderFromRow));
      }

      if (productsResult.error || kitsResult.error) {
        toast.error('No se pudo cargar el conteo de catálogo');
        setActiveCatalogItems(0);
      } else {
        setActiveCatalogItems((productsResult.count ?? 0) + (kitsResult.count ?? 0));
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);
  const monthlySales = useMemo(() => {
    const now = new Date();
    return orders
      .filter(order => {
        const createdAt = new Date(order.created_at);
        return order.payment_status === 'paid' &&
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear();
      })
      .reduce((sum, order) => sum + order.total_amount, 0);
  }, [orders]);
  const pendingOrders = useMemo(
    () => orders.filter(o => o.order_status === 'new' || o.order_status === 'contacted'),
    [orders]
  );
  const pendingShipment = useMemo(
    () => orders.filter(o => o.payment_status === 'paid' && o.order_status === 'paid').length,
    [orders]
  );

  const kpis: KPICardProps[] = [
    {
      title: 'Ventas del mes',
      value: `$${monthlySales.toLocaleString('es-AR')}`,
      subtitle: 'Órdenes pagadas',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      delay: 0.05,
    },
    {
      title: 'Órdenes nuevas',
      value: String(pendingOrders.length),
      subtitle: 'Requieren atención',
      icon: ShoppingCart,
      iconColor: 'text-[#0EA5E9]',
      iconBg: 'bg-[#0EA5E9]/10',
      delay: 0.1,
    },
    {
      title: 'Productos activos',
      value: String(activeCatalogItems),
      subtitle: 'Productos + kits',
      icon: Package,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      delay: 0.15,
    },
    {
      title: 'Pendientes de envío',
      value: String(pendingShipment),
      subtitle: 'Listos para despachar',
      icon: Truck,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
      delay: 0.2,
    },
  ];

  return (
    <>
      <AdminTopbar
        title="Panel"
        subtitle={loading ? 'Cargando datos...' : 'Resumen general del negocio'}
      />

      <main className="p-4 lg:p-6 space-y-6">
        {/* Banner principal */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#0EA5E9]/20 bg-gradient-to-r from-[#0EA5E9]/5 to-transparent p-4 flex items-center gap-3"
        >
          <TrendingUp className="h-5 w-5 text-[#0EA5E9] shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Panel de administración</p>
            <p className="text-xs text-[#64748B]">Gestioná tus productos y órdenes desde acá</p>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.title} {...kpi} />
          ))}
        </div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RecentOrdersTable orders={recentOrders} />
        </motion.div>
      </main>
    </>
  );
}
