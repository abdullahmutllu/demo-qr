import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, QrCode, Sparkles } from 'lucide-react';
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
      <div className="app-shell relative flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <div className="surface-panel-subtle max-w-sm rounded-2xl p-8">
          <p className="text-slate-400">Mekan bulunamadı.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center justify-center font-display text-sm font-semibold text-teal-300 hover:text-teal-200"
          >
            Başlangıca dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell relative min-h-screen text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/[0.07] bg-[#08090e]/80 px-4 py-4 backdrop-blur-xl md:px-6">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-5xl items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/30 to-violet-500/20 text-teal-200 ring-1 ring-white/15">
            <QrCode className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display truncate text-[15px] font-bold text-white">{venue.name}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/25 bg-teal-500/10 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-teal-200/95">
                <Sparkles className="h-3 w-3" aria-hidden />
                AI
              </span>
            </div>
            <div className="mt-0.5 text-[12px] text-slate-500">
              {lang === 'tr' ? 'Masa' : 'Table'} <span className="font-semibold text-slate-400">{table}</span>
              <span className="text-slate-600"> · </span>
              {lang === 'tr' ? 'Misafir deneyimi' : 'Guest experience'}
            </div>
          </div>
          <Link
            to="/"
            className="font-display inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/[0.16] hover:bg-white/[0.07]"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            {lang === 'tr' ? 'Personel' : 'Staff'}
          </Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 pb-10 md:p-8">
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
