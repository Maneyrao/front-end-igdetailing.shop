export const STORE_NAME = 'IG Detailing Shop';
export const STORE_TAGLINE = 'Cuidado técnico del auto';
export const STORE_EMAIL = 'info@igdetailing.com';
export const STORE_WHATSAPP = '5491100000000';
export const STORE_ADDRESS = 'Dirección a confirmar';
export const STORE_MAP_QUERY = 'Buenos Aires, Argentina';
export const FREE_SHIPPING_FROM = 50000;
export const STANDARD_SHIPPING_COST = 4500;

export const BANK_TRANSFER = {
  bank: 'A coordinar',
  cbu: '',
  alias: 'IG.DETAIL.MP',
  holder: STORE_NAME,
};

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
