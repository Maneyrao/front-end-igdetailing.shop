import { Link } from 'react-router';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050607] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <ShoppingBag className="h-7 w-7 text-[#38BDF8]" />
        </div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#38BDF8]">404</p>
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">Página no encontrada</h1>
        <p className="mt-4 text-slate-400">
          El enlace no existe o cambió de ubicación. Podés volver al catálogo para seguir comprando.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/productos"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0EA5E9] px-6 py-3 text-sm font-black text-white transition hover:bg-[#38BDF8]"
          >
            <ShoppingBag className="h-4 w-4" />
            Ver productos
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/[0.06]"
          >
            <Home className="h-4 w-4" />
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
