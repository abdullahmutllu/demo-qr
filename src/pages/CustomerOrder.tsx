import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, QrCode } from 'lucide-react';
import type { Lang } from '../types/order';
import { venueBySlug } from '../data/venues';
import ChatOrderPanel from '../components/ChatOrderPanel';

export default function CustomerOrder() {
  const { venueSlug, tableId } = useParams();
  const [lang, setLang] = useState<Lang>('tr');

  const venue = useMemo(() => (venueSlug ? venueBySlug(venueSlug) : undefined), [venueSlug]);
  const table = tableId ?? '1';

  if (!venue) {
    return (
      <div className="app-shell flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-400">Mekan bulunamadı.</p>
        <Link to="/" className="mt-4 text-cyan-400 hover:underline">
          Başlangıca dön
        </Link>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#0a0a10]/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <QrCode className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">{venue.name}</div>
            <div className="text-[11px] text-slate-500">
              {lang === 'tr' ? 'Masa' : 'Table'} {table} · QR demo
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/[0.1] px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/[0.05]"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            {lang === 'tr' ? 'Personel' : 'Staff'}
          </Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 md:p-6">
        <ChatOrderPanel
          venueId={venue.id}
          venueName={venue.name}
          tableId={table}
          lang={lang}
          onLangChange={setLang}
        />
      </div>
    </div>
  );
}
