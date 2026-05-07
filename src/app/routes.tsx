import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ShippingPage, { ReturnsPage, TeamPage } from './pages/ShippingPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';

export const router = createBrowserRouter([
  // ── Tienda ──────────────────────────────────────────────────
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'productos', Component: ProductsPage },
      { path: 'envios', Component: ShippingPage },
      { path: 'equipo', Component: TeamPage },
      { path: 'devoluciones', Component: ReturnsPage },
      { path: 'product/:slug', Component: ProductPage },
      { path: 'category/:category', Component: CategoryPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'order-success', Component: OrderSuccess },
      { path: '*', Component: NotFoundPage },
    ],
  },

  // ── Panel de administración ──────────────────────────────────
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'products', Component: AdminProducts },
      { path: 'inventory', Component: AdminInventory },
      { path: 'orders', Component: AdminOrders },
    ],
  },
]);
