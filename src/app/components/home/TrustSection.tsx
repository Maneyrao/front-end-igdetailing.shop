import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, MessageCircle, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { HAS_CONFIRMED_WHATSAPP, buildWhatsAppUrl } from '../../../lib/business';

const trustItems = [
  {
    icon: PackageCheck,
    title: 'Stock visible',
    description: 'Cada producto muestra disponibilidad antes de comprar.',
  },
  {
    icon: MessageCircle,
    title: 'Pago coordinado',
    description: 'Transferencia o WhatsApp hasta activar Mercado Pago.',
  },
  {
    icon: Truck,
    title: 'Envío a coordinar',
    description: 'Pedido recibido y seguimiento manual por el equipo.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra cuidada',
    description: 'Validamos el pago antes de preparar y despachar.',
  },
];

const proofItems = [
  'Stock visible antes de comprar',
  'Kits y productos sueltos',
  'Pedido confirmado con número',
  'Seguimiento por WhatsApp',
];

export const TrustSection = () => {
  return (
    <section className="bg-[#050607] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-xl border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-300/10">
                <item.icon className="h-5 w-5 text-[#38BDF8]" />
              </div>
              <h3 className="font-black text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#0B0F14]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#38BDF8]">
                Compra simple
              </p>
              <h2 className="max-w-2xl text-3xl font-black tracking-tight text-white md:text-4xl">
                Todo claro antes de confirmar el pedido.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-400">
                Elegís productos, revisás stock, confirmás tus datos y coordinás el pago manual
                con el número de pedido generado.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/category/kits"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0EA5E9] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#38BDF8]"
                >
                  Ver kits
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {HAS_CONFIRMED_WHATSAPP && (
                  <a
                    href={buildWhatsAppUrl('Hola! Quiero consultar por productos de detailing.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/[0.06]"
                  >
                    Consultar por WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/25 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="space-y-3">
                {proofItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3">
                    <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-300" />
                    <span className="text-sm font-semibold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
