import { Link, useLocation } from 'react-router';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle, MessageCircle, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatARS } from '../../lib/format';
import { BANK_TRANSFER, buildWhatsAppUrl } from '../../lib/business';

interface OrderSuccessState {
  orderNumber?: string;
  orderId?: string;
  total?: number;
  customerName?: string;
  customerEmail?: string;
}

export default function OrderSuccess() {
  const location = useLocation();
  const { clearCart } = useCart();
  const state = location.state as OrderSuccessState | null;

  const orderNumber = state?.orderNumber;
  const total = state?.total;
  const customerName = state?.customerName;
  const customerEmail = state?.customerEmail;

  useEffect(() => {
    if (orderNumber) {
      clearCart();
    }
  }, [orderNumber]);

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-[#050607] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="bg-[#0B0F14] rounded-2xl p-8 border border-white/10">
            <AlertCircle className="w-16 h-16 text-[#38BDF8] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-3">No encontramos un pedido activo</h1>
            <p className="text-gray-400 mb-6">
              Esta pantalla se muestra después de confirmar una compra. Podés volver al catálogo o revisar el carrito.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/productos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0EA5E9] text-white font-semibold rounded-lg hover:bg-[#38BDF8] transition"
              >
                Ver productos
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
              >
                Ver carrito
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const waLink = buildWhatsAppUrl(`Hola, quiero confirmar el pago de mi pedido ${orderNumber}`);

  return (
    <div className="min-h-screen bg-[#050607] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-[#0B0F14] rounded-2xl p-8 md:p-12 border border-white/10 text-center">
          {/* Icono de éxito */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-24 h-24 text-green-500" />
          </motion.div>

          {/* Mensaje principal */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            ¡Pedido recibido{customerName ? `, ${customerName}` : ''}!
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Tu pedido fue registrado correctamente. Seguí los pasos de abajo para completar la compra.
          </p>

          {/* Número de pedido */}
          <div className="bg-white/[0.06] rounded-xl p-6 mb-6">
            <p className="text-gray-400 text-sm mb-1">Número de pedido</p>
            <p className="text-2xl font-bold text-[#0EA5E9]">{orderNumber}</p>
            {total !== undefined && (
              <p className="text-gray-300 mt-2">
                Total: <span className="text-white font-semibold">{formatARS(total)}</span>
              </p>
            )}
            {customerEmail && (
              <p className="text-gray-400 text-sm mt-2">
                Te enviamos la confirmación a <span className="text-white">{customerEmail}</span>
              </p>
            )}
          </div>

          {/* Próximos pasos */}
          <div className="bg-white/[0.06] rounded-xl p-6 mb-8 text-left">
            <h2 className="text-white font-bold text-lg mb-4">Próximos pasos</h2>
            <ol className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">1</span>
                <span>
                  Realizá la transferencia al CBU/Alias indicado por el monto total de tu pedido.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">2</span>
                <span>
                  Envianos el comprobante por WhatsApp junto con tu número de pedido{' '}
                  <span className="text-[#0EA5E9] font-mono">{orderNumber}</span>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">3</span>
                <span>
                  Una vez confirmado el pago, preparamos y despachamos tu pedido.
                </span>
              </li>
            </ol>

            {/* Datos de transferencia */}
            <div className="mt-5 pt-5 border-t border-gray-700 space-y-2 text-sm">
              <p className="text-gray-400 font-medium mb-3">Datos para transferencia:</p>
              {BANK_TRANSFER.bank !== 'A coordinar' && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Banco</span>
                  <span className="text-white">{BANK_TRANSFER.bank}</span>
                </div>
              )}
              {BANK_TRANSFER.cbu && (
                <div className="flex justify-between">
                  <span className="text-gray-400">CBU</span>
                  <span className="text-white font-mono text-xs">{BANK_TRANSFER.cbu}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Alias</span>
                <span className="text-white">{BANK_TRANSFER.alias}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Titular</span>
                <span className="text-white">{BANK_TRANSFER.holder}</span>
              </div>
            </div>
          </div>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition"
            >
              <MessageCircle className="w-5 h-5" />
              Confirmar pago por WhatsApp
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              <Home className="w-4 h-4" />
              Seguir comprando
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
