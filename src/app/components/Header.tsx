import { Link } from 'react-router';
import { ChevronDown, Menu, PackageSearch, RotateCcw, ShoppingCart, Truck, Users, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { PRODUCT_CATEGORIES } from '../../lib/catalog';
import { CartDrawer } from './CartDrawer';

const promoMessages = [
  '10% OFF en efectivo',
  'Envío gratis desde $50.000',
  'Kits listos para arrancar',
  'Stock actualizado',
  'Cambios simples y rápidos',
];

const navItems = [
  { to: '/envios', label: 'Envíos', icon: Truck },
  { to: '/equipo', label: 'Equipo', icon: Users },
  { to: '/devoluciones', label: 'Devoluciones', icon: RotateCcw },
];

export const Header = () => {
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = getCartCount();
  const closeNavigation = () => {
    setMobileMenuOpen(false);
    setProductsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-[#050607]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <BrandLogo variant="header" showTagline />
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setProductsOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full bg-[#0EA5E9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#38BDF8]"
              aria-expanded={productsOpen}
              aria-controls="desktop-products-menu"
            >
              Productos
              <ChevronDown className={`h-4 w-4 transition ${productsOpen ? 'rotate-180' : ''}`} />
            </button>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setProductsOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0EA5E9] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:text-white"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/10 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/productos"
                className="rounded-lg bg-[#0EA5E9]/15 px-3 py-3 text-sm font-black text-[#38BDF8]"
                onClick={closeNavigation}
              >
                Productos
              </Link>
              <div className="grid grid-cols-2 gap-2 pb-2">
                {PRODUCT_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300"
                    onClick={closeNavigation}
                  >
                    {category.shortName}
                  </Link>
                ))}
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                  onClick={closeNavigation}
                >
                  <item.icon className="h-4 w-4 text-[#38BDF8]" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
      <div className="promo-ticker border-t border-cyan-300/15 bg-[#0EA5E9] text-white" aria-label="Promociones de la tienda">
        <div className="overflow-hidden">
          <div className="promo-marquee-track flex w-max items-center gap-6 py-2 text-[11px] font-black uppercase tracking-[0.18em] sm:text-xs">
            {[...promoMessages, ...promoMessages].map((message, index) => (
              <span key={`${message}-${index}`} className="inline-flex items-center gap-6 whitespace-nowrap">
                <span>{message}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>
      {productsOpen && (
        <div id="desktop-products-menu" className="absolute inset-x-0 top-full z-[60] hidden px-4 pt-3 md:block">
          <div className="mx-auto w-[min(720px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#071018] p-3 shadow-2xl shadow-black/60">
            <Link
              to="/productos"
              onClick={closeNavigation}
              className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/10">
                <PackageSearch className="h-6 w-6 text-[#38BDF8]" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black">Todos los productos</span>
                <span className="block text-sm text-slate-400">Catálogo completo por etapa de uso</span>
              </span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              {PRODUCT_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  onClick={closeNavigation}
                  className="rounded-xl border border-transparent px-4 py-3 text-slate-300 transition hover:border-cyan-300/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black">{category.shortName}</span>
                    <span className="text-xs font-bold text-slate-500">{category.featured ? 'Recomendado' : 'Ver'}</span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">{category.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
};
