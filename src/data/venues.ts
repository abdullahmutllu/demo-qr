import type { Venue } from '../types/order';

export const venues: Venue[] = [
  { id: 'v1', slug: 'bora-beach', name: 'Bora Beach Club', city: 'Bodrum' },
  { id: 'v2', slug: 'mavi-restaurant', name: 'Mavi Restaurant', city: 'İstanbul' },
  { id: 'v3', slug: 'liman-gastro', name: 'Liman Gastro Bar', city: 'Çeşme' },
];

export function venueBySlug(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug);
}
