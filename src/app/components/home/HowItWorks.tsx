import { motion } from 'motion/react';
import { Target, Package, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Target,
    title: 'Elegí el objetivo',
    description: 'Lavado seguro, interior, protección o kit completo. Cada categoría está pensada por uso.'
  },
  {
    icon: Package,
    title: 'Armá el pedido',
    description: 'Sumás productos al carrito, revisás el total y dejás tus datos de envío.'
  },
  {
    icon: Sparkles,
    title: 'Coordinás el pago',
    description: 'Por ahora el pago es manual: transferencia o WhatsApp. Después preparamos el pedido.'
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#050607] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#38BDF8]">
              Flujo de compra
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Compra simple, controlada y manual
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Confirmás el pedido, coordinás el pago y recibís seguimiento por WhatsApp.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-6 text-center">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="relative bg-[#0EA5E9] p-5 rounded-full">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#050607] border-2 border-[#0EA5E9] rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-[#0EA5E9] font-bold text-sm">{index + 1}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
