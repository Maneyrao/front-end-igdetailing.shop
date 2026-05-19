import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { supabase } from '../../lib/supabase';
import { formatARS } from '../../lib/format';
import {
  BANK_TRANSFER,
  FREE_SHIPPING_FROM,
  getCashDiscount,
  getCashPaymentTotal,
  getOnlinePaymentTotal,
  HAS_CONFIRMED_BANK_TRANSFER,
  STANDARD_SHIPPING_COST,
} from '../../lib/business';
import { BackLink } from '../components/BackLink';

// Genera un número de pedido único-ish basado en timestamp en base 36.
// Ejemplo: IG-M5KZQP1A
const generateOrderNumber = () =>
  `IG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

type StockRequirement = {
  productId: string;
  productName: string;
  quantity: number;
};

function addRequirement(
  requirements: Map<string, StockRequirement>,
  productId: string,
  productName: string,
  quantity: number
) {
  const current = requirements.get(productId);
  requirements.set(productId, {
    productId,
    productName: current?.productName ?? productName,
    quantity: (current?.quantity ?? 0) + quantity,
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getCartTotal } = useCart();

  // Campos del formulario
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  if (items.length === 0) return null;

  // Envío gratuito por compras mayores a $50.000 ARS, sino $4.500 ARS
  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : STANDARD_SHIPPING_COST;
  const cashDiscount = getCashDiscount(subtotal);
  const cashTotal = getCashPaymentTotal(subtotal, shipping);
  const onlineTotal = getOnlinePaymentTotal(subtotal, shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!email || !firstName || !lastName || !phone || !address || !city || !zipCode) {
      toast.error('Por favor completá todos los campos obligatorios.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('El email ingresado no es válido.');
      return;
    }

    setSubmitting(true);

    try {
      // Validación de stock inspirada en backend-roma: el pedido no se crea si
      // alguna unidad requerida ya no está disponible.
      const requirements = new Map<string, StockRequirement>();
      const kitIds = items
        .filter(item => item.product.category === 'kits')
        .map(item => item.product.id);

      if (kitIds.length > 0) {
        const { data: kits, error: kitsError } = await supabase
          .from('kits')
          .select('id,name,items')
          .in('id', kitIds)
          .eq('is_active', true)
          .eq('status', 'active');

        if (kitsError) throw kitsError;

        const kitsById = new Map((kits ?? []).map(kit => [kit.id, kit]));
        for (const item of items.filter(cartItem => cartItem.product.category === 'kits')) {
          const kit = kitsById.get(item.product.id);
          if (!kit) throw new Error(`El kit "${item.product.name}" no está disponible.`);

          const kitItems = Array.isArray(kit.items) ? kit.items : [];
          for (const kitItem of kitItems) {
            const productId = kitItem.product_id ?? kitItem.productId;
            const quantity = Number(kitItem.quantity ?? 1);
            if (productId) {
              addRequirement(requirements, productId, item.product.name, item.quantity * quantity);
            }
          }
        }
      }

      for (const item of items.filter(cartItem => cartItem.product.category !== 'kits')) {
        addRequirement(requirements, item.product.id, item.product.name, item.quantity);
      }

      if (requirements.size > 0) {
        const { data: stockRows, error: stockError } = await supabase
          .from('products')
          .select('id,name,stock')
          .in('id', Array.from(requirements.keys()))
          .eq('is_active', true)
          .eq('status', 'active');

        if (stockError) throw stockError;

        const stockById = new Map((stockRows ?? []).map(row => [row.id, row]));
        for (const requirement of requirements.values()) {
          const stockRow = stockById.get(requirement.productId);
          if (!stockRow) throw new Error(`"${requirement.productName}" ya no está disponible.`);
          if (Number(stockRow.stock ?? 0) < requirement.quantity) {
            throw new Error(`No hay stock suficiente de "${stockRow.name}".`);
          }
        }
      }

      const order_number = generateOrderNumber();
      const order_id = crypto.randomUUID();
      const total_amount = onlineTotal;

      // 1. Insertar la orden en Supabase
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: order_id,
          order_number,
          customer_name: `${firstName} ${lastName}`,
          customer_email: email,
          customer_phone: phone,
          shipping_address: `${address}, CP ${zipCode}`,
          shipping_city: city,
          total_amount,
          payment_status: 'pending',
          order_status: 'new',
          notes: notes || null,
        });

      if (orderError) throw orderError;

      // 2. Insertar los ítems de la orden
      const orderItems = items.map((item) => ({
        order_id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image,
        quantity: item.quantity,
        unit_price: item.product.price,
        item_type: item.product.category === 'kits' ? 'kit' : 'product',
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Crear preferencia de Mercado Pago desde Edge Function privada.
      const { data: preference, error: preferenceError } = await supabase.functions.invoke('create-preference', {
        body: { orderId: order_id },
      });

      if (preferenceError) throw preferenceError;

      const checkoutUrl = preference?.init_point ?? preference?.sandbox_init_point;
      if (!checkoutUrl || typeof checkoutUrl !== 'string') {
        throw new Error('Mercado Pago no devolvió un link de pago.');
      }

      window.location.assign(checkoutUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al procesar el pedido.';
      console.error('Error al crear la orden:', err);
      toast.error(`No se pudo iniciar el pago: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] py-8 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackLink fallback="/cart" label="Volver al carrito" className="mb-8" forceFallback />

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Finalizar compra</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Usamos tus datos solo para coordinar el pedido y el envío.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <motion.form
              id="checkout-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Información de contacto */}
              <div className="bg-[#0B0F14] rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6">Información de contacto</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkout-email" className="block text-gray-300 mb-2">Email *</label>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9] transition"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de envío */}
              <div className="bg-[#0B0F14] rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6">Datos de envío</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkout-first-name" className="block text-gray-300 mb-2">Nombre *</label>
                    <input
                      id="checkout-first-name"
                      name="given-name"
                      type="text"
                      required
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9] transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-last-name" className="block text-gray-300 mb-2">Apellido *</label>
                    <input
                      id="checkout-last-name"
                      name="family-name"
                      type="text"
                      required
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9] transition"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-phone" className="block text-gray-300 mb-2">Teléfono / WhatsApp *</label>
                    <input
                      id="checkout-phone"
                      name="tel"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9] transition"
                      placeholder="+54 9 11 0000-0000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-address" className="block text-gray-300 mb-2">Dirección *</label>
                    <input
                      id="checkout-address"
                      name="street-address"
                      type="text"
                      required
                      autoComplete="street-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9] transition"
                      placeholder="Calle 123, Piso 4, Dpto B"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-city" className="block text-gray-300 mb-2">Ciudad *</label>
                    <input
                      id="checkout-city"
                      name="address-level2"
                      type="text"
                      required
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9] transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-zip" className="block text-gray-300 mb-2">Código Postal *</label>
                    <input
                      id="checkout-zip"
                      name="postal-code"
                      type="text"
                      required
                      autoComplete="postal-code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9] transition"
                      placeholder="1234"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-notes" className="block text-gray-300 mb-2">Notas adicionales (opcional)</label>
                    <textarea
                      id="checkout-notes"
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0EA5E9] transition resize-none"
                      placeholder="Horario preferido de entrega, instrucciones especiales, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Sección de pago */}
              <div className="bg-[#0B0F14] rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Pago con Mercado Pago</h2>
                <p className="text-gray-400 mb-5 text-sm leading-relaxed">
                  Al confirmar te llevamos a Mercado Pago para completar el pago online. El pedido queda pendiente
                  hasta que Mercado Pago confirme la operación.
                </p>

                {HAS_CONFIRMED_BANK_TRANSFER ? (
                  <div className="bg-white/[0.06] rounded-xl p-5 space-y-3 text-sm">
                    {BANK_TRANSFER.bank !== 'A coordinar' && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Banco</span>
                        <span className="text-white font-medium">{BANK_TRANSFER.bank}</span>
                      </div>
                    )}
                    {BANK_TRANSFER.cbu && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">CBU</span>
                        <span className="text-white font-mono">{BANK_TRANSFER.cbu}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Alias</span>
                      <span className="text-white font-medium">{BANK_TRANSFER.alias}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Titular</span>
                      <span className="text-white font-medium">{BANK_TRANSFER.holder}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-relaxed text-cyan-50">
                    El 10% OFF aplica solo para efectivo o transferencia coordinada manualmente.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="hidden w-full bg-[#0EA5E9] text-white font-semibold py-4 rounded-lg hover:bg-[#38BDF8] transition disabled:opacity-50 disabled:cursor-not-allowed sm:block"
              >
                {submitting ? 'Redirigiendo...' : `Pagar con Mercado Pago · ${formatARS(onlineTotal)}`}
              </button>
            </motion.form>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0B0F14] rounded-xl p-6 border border-white/10 sticky top-24"
            >
              <h2 className="text-xl font-bold text-white mb-6">Resumen del pedido</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-semibold truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-400 text-sm">Cant.: {item.quantity}</p>
                      <p className="text-white font-semibold">
                        {formatARS(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatARS(subtotal)}</span>
                </div>
                <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-3">
                  <div className="flex justify-between text-cyan-50">
                    <span className="font-black">10% OFF efectivo</span>
                    <span className="font-black">-{formatARS(cashDiscount)}</span>
                  </div>
                  <p className="mt-1 text-xs text-cyan-100/80">
                    Efectivo/transferencia: {formatARS(cashTotal)} al coordinar el pedido.
                  </p>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'GRATIS' : formatARS(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Envío gratis en compras mayores a {formatARS(FREE_SHIPPING_FROM)}
                  </p>
                )}
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total Mercado Pago</span>
                    <span>{formatARS(onlineTotal)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#050607]/95 p-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-cyan-100">Total Mercado Pago</p>
            <p className="truncate text-lg font-black text-white">{formatARS(onlineTotal)}</p>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={submitting}
            className="rounded-lg bg-[#0EA5E9] px-5 py-3 text-sm font-black text-white transition hover:bg-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Redirigiendo...' : 'Pagar'}
          </button>
        </div>
      </div>
    </div>
  );
}
