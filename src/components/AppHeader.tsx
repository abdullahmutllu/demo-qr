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
    <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0c0c12]/90 px-4 py-2 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="truncate font-medium text-slate-500">{product}</span>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
        <span className="truncate font-semibold text-slate-100">{section}</span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <label className="sr-only" htmlFor="staff-venue">
          Aktif mekan
        </label>
        <select
          id="staff-venue"
          value={venue.slug}
          onChange={(e) => setVenueSlug(e.target.value)}
          className="max-w-[200px] rounded-lg border border-white/[0.1] bg-[#0c0c14] px-2 py-1.5 text-xs font-medium text-slate-200 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
        >
          {venues.map((v) => (
            <option key={v.id} value={v.slug}>
              {v.name}
            </option>
          ))}
        </select>
        <span className="hidden rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-slate-500 md:inline">
          demo.local
        </span>
        <Link
          to="/v/bora-beach/m/7"
          className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
        >
          <QrCode className="h-3.5 w-3.5" aria-hidden />
          Müşteri QR
        </Link>
        <Link
          to="/mutfak"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.07]"
        >
          <ChefHat className="h-3.5 w-3.5" aria-hidden />
          KDS
        </Link>
        <span
          className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-[10px] font-medium text-emerald-400/90"
          title="Simülasyon — NDA sonrası POS ve veritabanı bağlanır"
        >
          <Sparkles className="h-3 w-3" aria-hidden />
          Demo
        </span>
      </div>
    </header>
  );
}
