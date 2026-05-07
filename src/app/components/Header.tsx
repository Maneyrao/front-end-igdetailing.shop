import { Link } from 'react-router';
import { ChevronDown, Menu, PackageSearch, RotateCcw, ShoppingCart, Truck, Users, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { PRODUCT_CATEGORIES } from '../../lib/catalog';
import { CartDrawer } from './CartDrawer';

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
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 rounded-full bg-[#0EA5E9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#38BDF8]"
                onFocus={() => setProductsOpen(true)}
              >
                Productos
                <ChevronDown className={`h-4 w-4 transition ${productsOpen ? 'rotate-180' : ''}`} />
              </Link>
              {productsOpen && (
                <div className="absolute left-0 top-full w-[360px] pt-3">
                  <div className="overflow-hidden rounded-xl border border-cyan-300/15 bg-[#071018] p-2 shadow-2xl shadow-black/50">
                    <Link
                      to="/productos"
                      onClick={closeNavigation}
                      className="mb-2 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/10">
                        <PackageSearch className="h-5 w-5 text-[#38BDF8]" />
                      </span>
                      <span>
                        <span className="block text-sm font-black">Todos los productos</span>
                        <span className="block text-xs text-slate-400">Catálogo por etapa de uso</span>
                      </span>
                    </Link>
                    <div className="grid grid-cols-1 gap-1">
                      {PRODUCT_CATEGORIES.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/category/${category.slug}`}
                          onClick={closeNavigation}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          {category.shortName}
                          <span className="text-xs font-medium text-slate-500">{category.featured ? 'Recomendado' : 'Ver'}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
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
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
};
