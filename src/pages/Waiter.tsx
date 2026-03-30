import { useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export default function Waiter() {
  const { waiterInbox, markWaiterRead } = useOrders();
  const [lang, setLang] = useState<'tr' | 'en'>('tr');

  const unread = waiterInbox.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/25 to-orange-600/15 text-amber-100 ring-1 ring-white/10">
            {unread > 0 ? (
              <BellRing className="h-6 w-6 animate-pulse" aria-hidden />
            ) : (
              <Bell className="h-6 w-6" aria-hidden />
            )}
            {unread > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 font-display text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
                {unread}
              </span>
            ) : null}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Garson bildirimleri</h1>
            <p className="text-sm text-slate-500">
              Anlık kuyruk · üretimde FCM / APNs ile push
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          className="font-display rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-300 transition hover:border-teal-500/35 hover:text-white"
        >
          {lang === 'tr' ? 'EN' : 'TR'}
        </button>
      </div>

      <ul className="space-y-3">
        {waiterInbox.length === 0 ? (
          <li className="surface-panel-subtle rounded-3xl border border-dashed border-white/[0.1] p-12 text-center text-sm text-slate-500">
            Bildirim yok.
          </li>
        ) : (
          waiterInbox.map((n) => (
            <li
              key={n.id}
              className={[
                'surface-panel rounded-3xl px-5 py-4 transition',
                n.read ? 'opacity-60' : 'ring-1 ring-amber-500/20',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-sm font-bold text-white">{n.venueName}</div>
                  <div className="mt-1 text-sm leading-relaxed text-slate-300">
                    {lang === 'tr' ? n.messageTr : n.messageEn}
                  </div>
                  <div className="mt-2 font-mono text-[11px] text-slate-600">
                    {new Date(n.createdAt).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                  </div>
                </div>
                {!n.read ? (
                  <button
                    type="button"
                    onClick={() => markWaiterRead(n.id)}
                    className="font-display shrink-0 rounded-xl border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-200 transition hover:bg-white/[0.08]"
                  >
                    {lang === 'tr' ? 'Okundu' : 'Read'}
                  </button>
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
