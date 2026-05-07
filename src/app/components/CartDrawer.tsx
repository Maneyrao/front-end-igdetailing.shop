import { Link } from 'react-router';
import { Minus, Plus, ShoppingCart, Trash2, Truck } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { useCart } from '../context/CartContext';
import { formatARS } from '../../lib/format';
import { FREE_SHIPPING_FROM, STANDARD_SHIPPING_COST } from '../../lib/business';

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const freeShippingFrom = FREE_SHIPPING_FROM;
  const shipping = subtotal >= freeShippingFrom ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shipping;
  const amountForFreeShipping = Math.max(0, freeShippingFrom - subtotal);
  const progress = Math.min(100, Math.round((subtotal / freeShippingFrom) * 100));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-cyan-300/15 bg-[#050607] p-0 text-white sm:max-w-[430px]">
        <SheetHeader className="border-b border-white/10 p-5">
          <SheetTitle className="flex items-center gap-2 text-white">
            <ShoppingCart className="h-5 w-5 text-[#38BDF8]" />
            Carrito
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            {items.length === 0 ? 'Todavía no agregaste productos.' : `${items.length} ${items.length === 1 ? 'producto' : 'productos'} en tu pedido.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <ShoppingCart className="h-7 w-7 text-slate-500" />
              </div>
              <p className="text-xl font-black text-white">Carrito vacío</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Entrá al catálogo, elegí un producto y agregalo al pedido.
              </p>
              <Link
                to="/productos"
                onClick={() => onOpenChange(false)}
                className="mt-6 inline-flex rounded-lg bg-[#0EA5E9] px-5 py-3 text-sm font-black text-white transition hover:bg-[#38BDF8]"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <>
              <div className="border-b border-white/10 p-5">
                <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-black text-white">
                    <Truck className="h-4 w-4 text-[#38BDF8]" />
                    {amountForFreeShipping === 0 ? 'Envío gratis desbloqueado' : `Faltan ${formatARS(amountForFreeShipping)}`}
                  </span>
                  <span className="rounded-full bg-white/[0.07] px-2 py-1 text-xs font-bold text-slate-300">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#38BDF8]" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {items.map((item) => (
                  <article key={item.product.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                    <div className="flex gap-3">
                      <Link to={`/product/${item.product.slug}`} onClick={() => onOpenChange(false)} className="shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-lg object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/product/${item.product.slug}`} onClick={() => onOpenChange(false)} className="line-clamp-2 text-sm font-black text-white hover:text-[#38BDF8]">
                            {item.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-500 transition hover:text-red-400"
                            aria-label="Quitar del carrito"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm font-bold text-[#38BDF8]">{formatARS(item.product.price * item.quantity)}</p>
                        <div className="mt-3 inline-flex items-center rounded-lg bg-white/[0.06]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 text-white transition hover:bg-white/10"
                            aria-label="Bajar cantidad"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-9 text-center text-sm font-black text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={!item.product.isKit && item.quantity >= (item.product.stock ?? 0)}
                            className="p-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                            aria-label="Subir cantidad"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-white/10 p-5">
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatARS(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{shipping === 0 ? 'GRATIS' : formatARS(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-black text-white">
                    <span>Total</span>
                    <span>{formatARS(total)}</span>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    onClick={() => onOpenChange(false)}
                    className="rounded-lg border border-white/10 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/[0.06]"
                  >
                    Ver carrito
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => onOpenChange(false)}
                    className="rounded-lg bg-[#0EA5E9] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#38BDF8]"
                  >
                    Finalizar
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
