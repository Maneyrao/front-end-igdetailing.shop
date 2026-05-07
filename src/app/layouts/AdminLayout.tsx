import { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Menu,
  X,
  ExternalLink,
  Lock,
  Mail,
  KeyRound,
  LogOut,
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { cn } from '../components/ui/utils';
import { Toaster } from '../components/ui/sonner';
import { supabase } from '../../lib/supabase';
import { BrandLogo } from '../components/BrandLogo';

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  { label: 'Panel', href: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Productos', href: '/admin/products', icon: Package, end: false },
  { label: 'Inventario', href: '/admin/inventory', icon: Boxes, end: false },
  { label: 'Órdenes', href: '/admin/orders', icon: ShoppingCart, end: false },
];

// ─── Sidebar content ─────────────────────────────────────────────────────────

function SidebarContent({ onClose, onSignOut }: { onClose?: () => void; onSignOut?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[#1E2030] px-5">
        <div>
          <BrandLogo variant="admin" />
          <p className="text-[10px] text-[#0EA5E9] font-semibold uppercase">Panel admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30'
                  : 'text-[#94A3B8] hover:bg-[#1E2030] hover:text-white border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#0EA5E9]' : '')} />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#0EA5E9]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1E2030] p-3 space-y-2">
        <NavLink
          to="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-[#64748B] hover:text-white transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver tienda
        </NavLink>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-[#64748B] hover:text-white transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Cerrar sesión
        </button>
        <p className="px-3 text-[10px] text-[#374151]">IG Detailing Shop · panel v1.0</p>
      </div>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border border-[#1E2030] bg-[#0A0A12] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0EA5E9]/15">
            <Lock className="h-5 w-5 text-[#0EA5E9]" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Acceso administrador</h1>
            <p className="text-xs text-[#64748B]">Ingresá con tu usuario de Supabase Auth</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#94A3B8]">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#374151]" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#1E2030] bg-[#060608] py-2.5 pl-9 pr-3 text-sm text-white placeholder-[#374151] focus:border-[#0EA5E9] focus:outline-none"
                placeholder="admin@igdetailing.com"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#94A3B8]">Contraseña</span>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#374151]" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#1E2030] bg-[#060608] py-2.5 pl-9 pr-3 text-sm text-white placeholder-[#374151] focus:border-[#0EA5E9] focus:outline-none"
                placeholder="********"
                required
              />
            </div>
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-lg bg-[#0EA5E9] py-2.5 text-sm font-semibold text-white transition hover:bg-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </motion.form>
      <Toaster richColors theme="dark" />
    </div>
  );
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setCheckingSession(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center">
        <p className="text-sm text-[#64748B]">Verificando sesión...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-[#060608] text-white">
      {/* ── Desktop Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-[#0A0A12] border-r border-[#1E2030] lg:flex lg:flex-col">
        <SidebarContent onSignOut={handleSignOut} />
      </aside>

      {/* ── Mobile: Hamburger button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A0A12] border border-[#1E2030] text-white lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* ── Mobile: Overlay + Sidebar ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="sidebar"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A12] border-r border-[#1E2030] lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent onClose={() => setMobileOpen(false)} onSignOut={handleSignOut} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <Outlet />
      </div>

      <Toaster richColors theme="dark" />
    </div>
  );
}
