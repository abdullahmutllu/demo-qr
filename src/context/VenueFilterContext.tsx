import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { venueBySlug, venues } from '../data/venues';
import type { Venue } from '../types/order';

const STORAGE_KEY = 'demo-qr-venue-slug';

type VenueFilterValue = {
  venue: Venue;
  setVenueSlug: (slug: string) => void;
};

const VenueFilterContext = createContext<VenueFilterValue | null>(null);

export function VenueFilterProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? venues[0].slug;
    } catch {
      return venues[0].slug;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, slug);
    } catch {
      /* ignore */
    }
  }, [slug]);

  const venue = useMemo(() => venueBySlug(slug) ?? venues[0], [slug]);

  const value = useMemo(
    () => ({
      venue,
      setVenueSlug: setSlug,
    }),
    [venue],
  );

  return <VenueFilterContext.Provider value={value}>{children}</VenueFilterContext.Provider>;
}

export function useVenueFilter() {
  const ctx = useContext(VenueFilterContext);
  if (!ctx) {
    throw new Error('useVenueFilter VenueFilterProvider içinde kullanılmalıdır.');
  }
  return ctx;
}
