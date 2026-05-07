import { MapPin, MessageCircle, Navigation } from 'lucide-react';
import { buildWhatsAppUrl, STORE_ADDRESS, STORE_MAP_QUERY } from '../../../lib/business';

const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(STORE_MAP_QUERY)}&z=13&output=embed`;

export function StoreMap() {
  const whatsAppUrl = buildWhatsAppUrl('Hola! Quiero consultar la dirección y coordinar una compra.');
  const hasConfirmedAddress = !STORE_ADDRESS.toLowerCase().includes('confirmar');

  return (
    <section className="bg-[#050607] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase text-cyan-200">
              <MapPin className="h-4 w-4" />
              Ubicación
            </div>
            <h2 className="text-3xl font-black text-white md:text-4xl">Encontranos y coordiná tu pedido</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              La dirección exacta de retiro se coordina por WhatsApp cuando el pedido queda confirmado.
            </p>
          </div>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-500"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar por WhatsApp
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B0F14]">
          <div className="aspect-[16/10] w-full sm:aspect-[16/7]">
            <iframe
              title="Mapa de IG Detailing Shop"
              src={mapSrc}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
              <span>
                {hasConfirmedAddress ? 'Dirección:' : 'Retiro:'}{' '}
                <strong className="font-semibold text-white">
                  {hasConfirmedAddress ? STORE_ADDRESS : 'a coordinar por WhatsApp'}
                </strong>
              </span>
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_MAP_QUERY)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
            >
              Abrir en Google Maps
              <Navigation className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
