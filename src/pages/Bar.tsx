import { useMemo } from 'react';
import { Martini } from 'lucide-react';
import type { Order, OrderStatus, Station } from '../types/order';
import { menuById } from '../data/menu';
import { formatTry } from '../lib/format';
import { useOrders } from '../context/OrderContext';
import { useVenueFilter } from '../context/VenueFilterContext';

const station: Station = 'bar';

function lineMatchesStation(order: Order, st: Station): boolean {
  return order.lines.some((l) => menuById(l.menuItemId)?.station === st);
}

const statusLabels: Record<OrderStatus, string> = {
  new: 'Yeni',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  served: 'Tamam',
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  new: 'preparing',
  preparing: 'ready',
  ready: 'served',
  served: null,
};

export default function Bar() {
  const { orders, updateOrderStatus } = useOrders();
  const { venue } = useVenueFilter();

  const filtered = useMemo(
    () =>
      orders
        .filter((o) => o.venueId === venue.id)
        .filter((o) => lineMatchesStation(o, station))
        .filter((o) => o.status !== 'served'),
    [orders, venue.id],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-600/15 text-violet-100 ring-1 ring-white/10">
          <Martini className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Bar — KDS</h1>
          <p className="text-sm text-slate-500">{venue.name} · içecek istasyonu</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="surface-panel-subtle rounded-3xl border border-dashed border-white/[0.1] p-10 text-center text-sm text-slate-500">
            Bar tarafında bekleyen kalem yok.
          </div>
        ) : (
          filtered.map((o) => (
            <article
              key={o.id}
              className="surface-panel rounded-3xl p-5 transition hover:ring-1 hover:ring-violet-500/25"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <span className="font-display text-lg font-bold text-white">Masa {o.tableId}</span>
                <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-violet-200">
                  {statusLabels[o.status]}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {o.lines
                  .filter((l) => menuById(l.menuItemId)?.station === station)
                  .map((l) => (
                    <li key={l.menuItemId} className="flex justify-between text-slate-200">
                      <span>
                        {l.qty}× {l.name}
                      </span>
                      <span>{formatTry(l.unitPrice * l.qty)}</span>
                    </li>
                  ))}
              </ul>
              {nextStatus[o.status] ? (
                <button
                  type="button"
                  onClick={() => updateOrderStatus(o.id, nextStatus[o.status]!)}
                  className="font-display mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
                >
                  {statusLabels[nextStatus[o.status]!]}
                </button>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
