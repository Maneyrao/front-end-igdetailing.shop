import { Link } from 'react-router';
import type { ReactNode } from 'react';
import { ArrowRight, Clock, MapPin, PackageCheck, Truck } from 'lucide-react';
import { STORE_ADDRESS } from '../../lib/business';

export default function ShippingPage() {
  return (
    <InfoShell eyebrow="Envíos y retiro" title="Comprá con claridad antes de pagar.">
      <InfoGrid
        items={[
          { icon: Truck, title: 'Envíos coordinados', text: 'Confirmamos zona, costo y tiempo con tus datos antes de preparar el pedido.' },
          { icon: PackageCheck, title: 'Gratis desde $50.000', text: 'El carrito te muestra cuánto falta para llegar al envío gratis.' },
          { icon: Clock, title: 'Preparación manual', text: 'Los pedidos se preparan después de confirmar pago y disponibilidad.' },
          { icon: MapPin, title: 'Retiro', text: `Dirección: ${STORE_ADDRESS}.` },
        ]}
      />
    </InfoShell>
  );
}

export function TeamPage() {
  return (
    <InfoShell eyebrow="Equipo" title="Una tienda de detailing clara y directa.">
      <InfoGrid
        items={[
          { icon: PackageCheck, title: 'Selección técnica', text: 'Productos ordenados por lavado, interior, protección, accesorios y kits.' },
          { icon: Clock, title: 'Compra simple', text: 'Entrás al catálogo, filtrás, agregás al carrito y confirmás el pedido.' },
          { icon: Truck, title: 'Atención directa', text: 'Por ahora el cierre comercial se coordina manualmente para evitar errores de stock o entrega.' },
          { icon: MapPin, title: 'Local', text: 'La ubicación exacta queda lista para cargar cuando se confirme el punto de retiro.' },
        ]}
      />
    </InfoShell>
  );
}

export function ReturnsPage() {
  return (
    <InfoShell eyebrow="Devoluciones" title="Reglas simples para comprar tranquilo.">
      <InfoGrid
        items={[
          { icon: PackageCheck, title: 'Producto sin uso', text: 'Se revisan cambios de productos cerrados, sin uso y en buen estado.' },
          { icon: Clock, title: 'Coordinación rápida', text: 'Escribinos con tu número de pedido para revisar el caso y resolverlo.' },
          { icon: Truck, title: 'Entrega o retiro', text: 'Si hubo envío, coordinamos el camino más simple para cambio o devolución.' },
          { icon: MapPin, title: 'Soporte humano', text: 'La prioridad es evitar fricción y que el cliente sepa qué hacer en cada paso.' },
        ]}
      />
    </InfoShell>
  );
}

type InfoShellProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

function InfoShell({ eyebrow, title, children }: InfoShellProps) {
  return (
    <div className="min-h-screen bg-[#050607]">
      <section className="border-b border-white/10 bg-[#071018] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-black uppercase text-[#38BDF8]">{eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Información clara para que la compra no dependa de adivinar condiciones.
          </p>
        </div>
      </section>
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {children}
          <Link
            to="/productos"
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-[#0EA5E9] px-6 py-4 text-sm font-black uppercase text-white transition hover:bg-[#38BDF8]"
          >
            Ir a productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

type InfoGridItem = {
  icon: typeof Truck;
  title: string;
  text: string;
};

function InfoGrid({ items }: { items: InfoGridItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.title} className="rounded-xl border border-white/10 bg-[#0B0F14] p-6">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-300/10">
            <item.icon className="h-5 w-5 text-[#38BDF8]" />
          </div>
          <h2 className="text-xl font-black text-white">{item.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.text}</p>
        </article>
      ))}
    </div>
  );
}
