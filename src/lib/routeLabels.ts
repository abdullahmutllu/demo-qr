const labels: Record<string, { product: string; section: string }> = {
  '/': {
    product: 'QR Sipariş AI',
    section: 'Başlangıç',
  },
  '/mutfak': { product: 'QR Sipariş AI', section: 'Mutfak (KDS)' },
  '/bar': { product: 'QR Sipariş AI', section: 'Bar (KDS)' },
  '/garson': { product: 'QR Sipariş AI', section: 'Garson bildirimleri' },
  '/patron': { product: 'QR Sipariş AI', section: 'Patron özeti' },
  '/admin': { product: 'QR Sipariş AI', section: 'Mekan ve menü' },
};

export function getBreadcrumbs(pathname: string): { product: string; section: string } {
  const base = pathname.replace(/\/$/, '') || '/';
  return labels[base] ?? { product: 'QR Sipariş AI', section: 'Demo' };
}
