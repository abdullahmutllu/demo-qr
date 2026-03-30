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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-500/15 text-slate-200">
          <Settings2 className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Mekan ve menü (demo)</h1>
          <p className="text-sm text-slate-500">
            {venue.name} — tüm mekanlarda paylaşılan örnek menü. Düzenle yalnızca simülasyon.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c14]/70">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] bg-white/[0.03] text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Ürün (TR)</th>
              <th className="px-4 py-3 font-semibold">Product (EN)</th>
              <th className="px-4 py-3 font-semibold">İstasyon</th>
              <th className="px-4 py-3 font-semibold text-right">Fiyat</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {menuItems.map((m) => (
              <tr key={m.id} className="border-b border-white/[0.04] last:border-0">
                <td className="px-4 py-3 font-medium text-slate-100">{m.nameTr}</td>
                <td className="px-4 py-3 text-slate-400">{m.nameEn}</td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      'rounded-md px-2 py-0.5 text-[11px] font-medium',
                      m.station === 'bar'
                        ? 'bg-violet-500/15 text-violet-200'
                        : 'bg-orange-500/15 text-orange-200',
                    ].join(' ')}
                  >
                    {m.station === 'bar' ? 'Bar' : 'Mutfak'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-cyan-200/90">{formatTry(m.price)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditRow(m.id);
                      show('Demo: değişiklik kalıcı değil — NDA sonrası CMS bağlanır.');
                    }}
                    className="rounded-lg border border-white/[0.1] px-2 py-1 text-[11px] text-slate-300 hover:bg-white/[0.05]"
                  >
                    {editRow === m.id ? 'Kayıt…' : 'Düzenle'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
