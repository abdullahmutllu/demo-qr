import { Link, useLocation } from 'react-router-dom';
import { ChefHat, ChevronRight, QrCode, Sparkles } from 'lucide-react';
import { getBreadcrumbs } from '../lib/routeLabels';
import { venues } from '../data/venues';
import { useVenueFilter } from '../context/VenueFilterContext';

export default function AppHeader() {
  const { pathname } = useLocation();
  const { product, section } = getBreadcrumbs(pathname);
  const { venue, setVenueSlug } = useVenueFilter();

  return (
    <header className="relative z-10 flex min-h-[56px] shrink-0 flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-[#08090e]/75 px-5 py-3 backdrop-blur-xl md:px-8">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-400/35 to-transparent" aria-hidden />

      <div className="flex min-w-0 items-center gap-2 text-[13px]">
        <span className="font-display hidden truncate font-semibold text-slate-500 sm:inline">
          {product}
        </span>
        <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-600 sm:block" aria-hidden />
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
          <span className="truncate font-display text-[13px] font-semibold text-white">{section}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <label className="sr-only" htmlFor="staff-venue">
          Aktif mekan
        </label>
        <select
          id="staff-venue"
          value={venue.slug}
          onChange={(e) => setVenueSlug(e.target.value)}
          className="max-w-[220px] cursor-pointer rounded-xl border border-white/[0.1] bg-[#0c0e14] px-3 py-2 text-xs font-medium text-slate-200 shadow-inner shadow-black/20 transition hover:border-white/[0.14] focus:border-teal-500/45 focus:outline-none focus:ring-1 focus:ring-teal-500/25"
        >
          {venues.map((v) => (
            <option key={v.id} value={v.slug}>
              {v.name}
            </option>
          ))}
        </select>
        <span className="hidden rounded-lg border border-white/[0.06] bg-black/25 px-2.5 py-1 font-mono text-[10px] tracking-wide text-slate-500 md:inline">
          api.ready
        </span>
        <Link
          to="/v/bora-beach/m/7"
          className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/35 bg-gradient-to-b from-teal-500/20 to-teal-600/10 px-3 py-2 text-xs font-semibold text-teal-100 shadow-lg shadow-teal-500/10 transition hover:border-teal-400/50 hover:from-teal-500/25"
        >
          <QrCode className="h-3.5 w-3.5" aria-hidden />
          Müşteri QR
        </Link>
        <Link
          to="/mutfak"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/[0.14] hover:bg-white/[0.07]"
        >
          <ChefHat className="h-3.5 w-3.5" aria-hidden />
          KDS
        </Link>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.07] px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-emerald-300/95"
          title="Simülasyon — NDA sonrası POS ve veritabanı bağlanır"
        >
          <Sparkles className="h-3 w-3" aria-hidden />
          Demo
        </span>
      </div>
    </header>
  );
}
