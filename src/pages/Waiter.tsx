import { useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export default function Waiter() {
  const { waiterInbox, markWaiterRead } = useOrders();
  const [lang, setLang] = useState<'tr' | 'en'>('tr');

  const unread = waiterInbox.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-200">
            {unread > 0 ? (
              <BellRing className="h-6 w-6 animate-pulse" aria-hidden />
            ) : (
              <Bell className="h-6 w-6" aria-hidden />
            )}
            {unread > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            ) : null}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Garson bildirimleri</h1>
            <p className="text-sm text-slate-500">
              Yeni siparişte anlık kayıt (push prod: FCM / APNs simülasyonu)
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs text-slate-300"
        >
          {lang === 'tr' ? 'EN' : 'TR'}
        </button>
      </div>

      <ul className="space-y-2">
        {waiterInbox.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-white/[0.1] p-8 text-center text-slate-500">
            Bildirim yok.
          </li>
        ) : (
          waiterInbox.map((n) => (
            <li
              key={n.id}
              className={[
                'rounded-2xl border px-4 py-3 transition',
                n.read
                  ? 'border-white/[0.06] bg-[#0c0c14]/40 opacity-70'
                  : 'border-amber-500/30 bg-amber-500/5',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-white">{n.venueName}</div>
                  <div className="text-sm text-slate-300">
                    {lang === 'tr' ? n.messageTr : n.messageEn}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {new Date(n.createdAt).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                  </div>
                </div>
                {!n.read ? (
                  <button
                    type="button"
                    onClick={() => markWaiterRead(n.id)}
                    className="shrink-0 rounded-lg border border-white/[0.12] px-2 py-1 text-[11px] text-slate-200 hover:bg-white/[0.06]"
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
