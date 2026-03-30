import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { menuItems } from '../data/menu';
import { formatTry } from '../lib/format';
import { useVenueFilter } from '../context/VenueFilterContext';
import { useToast } from '../context/ToastContext';

export default function Admin() {
  const { venue } = useVenueFilter();
  const { show } = useToast();
  const [editRow, setEditRow] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500/30 to-slate-700/20 text-slate-100 ring-1 ring-white/10">
          <Settings2 className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Mekan ve menü</h1>
          <p className="text-sm text-slate-500">
            {venue.name} · paylaşılan örnek menü; düzenleme bu demoda simülasyon
          </p>
        </div>
      </div>

      <div className="surface-panel overflow-hidden rounded-3xl">
        <div className="border-b border-white/[0.06] bg-white/[0.03] px-5 py-3">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Ürün kataloğu
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Ürün (TR)</th>
                <th className="px-5 py-3 font-semibold">Product (EN)</th>
                <th className="px-5 py-3 font-semibold">İstasyon</th>
                <th className="px-5 py-3 text-right font-semibold">Fiyat</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {menuItems.map((m) => (
                <tr key={m.id} className="border-b border-white/[0.04] transition hover:bg-white/[0.02] last:border-0">
                  <td className="px-5 py-3.5 font-semibold text-slate-100">{m.nameTr}</td>
                  <td className="px-5 py-3.5 text-slate-400">{m.nameEn}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={[
                        'rounded-full px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wide',
                        m.station === 'bar'
                          ? 'bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/25'
                          : 'bg-orange-500/15 text-orange-200 ring-1 ring-orange-500/25',
                      ].join(' ')}
                    >
                      {m.station === 'bar' ? 'Bar' : 'Mutfak'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-display font-semibold text-teal-200/95">
                    {formatTry(m.price)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditRow(m.id);
                        show('Demo: kalıcı değişiklik yok — NDA sonrası CMS entegrasyonu.');
                      }}
                      className="rounded-xl border border-white/[0.1] px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wide text-slate-400 transition hover:border-teal-500/35 hover:text-white"
                    >
                      {editRow === m.id ? '···' : 'Düzenle'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
