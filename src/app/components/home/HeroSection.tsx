import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { HeroProductShowcase } from './HeroProductShowcase';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[640px] overflow-hidden bg-[#050607]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1723659081228-94b14d1e61d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkZXRhaWwlMjBzaGluZXxlbnwxfHx8fDE3NzYzODI1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Auto recién detallado"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.9)_34%,rgba(5,6,7,0.58)_68%,rgba(5,6,7,0.86)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050607] to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[640px] w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_430px] lg:px-8">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
            <BadgeCheck className="h-4 w-4" />
            Tienda de detailing
          </div>
          <BrandLogo variant="hero" className="mb-6" />
          <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl">
            Productos claros para dejar el auto{' '}
            <span className="block text-[#38BDF8]">como recién detallado.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Kits, shampoo, microfibras, ceras y accesorios seleccionados para lavar,
            proteger y mantener tu vehículo con stock visible y compra directa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/productos"
              className="group inline-flex items-center justify-center rounded-lg bg-[#0EA5E9] px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#38BDF8]"
            >
              Ver productos
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Cómo comprar
            </a>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ['8+', 'productos activos'],
              ['ARS', 'precios locales'],
              ['Manual', 'pago coordinado'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-lg font-black text-white">{value}</p>
                <p className="text-xs font-medium text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <HeroProductShowcase />
      </div>
    </section>
  );
};
