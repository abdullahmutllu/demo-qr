import { useMemo } from 'react';
import { ChefHat, Clock } from 'lucide-react';
import type { Order, OrderStatus, Station } from '../types/order';
import { menuById } from '../data/menu';
import { formatTry } from '../lib/format';
import { useOrders } from '../context/OrderContext';
import { useVenueFilter } from '../context/VenueFilterContext';

const station: Station = 'kitchen';

function lineMatchesStation(order: Order, st: Station): boolean {
  return order.lines.some((l) => menuById(l.menuItemId)?.station === st);
}

const statusLabels: Record<OrderStatus, string> = {
  new: 'Yeni',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  served: 'Servis',
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  new: 'preparing',
  preparing: 'ready',
  ready: 'served',
  served: null,
};

export default function Kitchen() {
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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/25 to-amber-600/15 text-orange-100 ring-1 ring-white/10">
          <ChefHat className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Mutfak — KDS</h1>
          <p className="text-sm text-slate-500">
            {venue.name} · <span className="font-medium text-slate-400">{filtered.length} aktif</span>
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="surface-panel-subtle rounded-3xl border border-dashed border-white/[0.1] p-10 text-center text-sm text-slate-500">
            Bekleyen mutfak siparişi yok. Müşteri QR ekranından sipariş gönderin.
          </div>
        ) : (
          filtered.map((o) => (
            <article
              key={o.id}
              className="surface-panel rounded-3xl p-5 transition hover:ring-1 hover:ring-orange-500/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div>
                  <span className="font-display text-lg font-bold text-white">Masa {o.tableId}</span>
                  <span className="ml-2 rounded-full bg-orange-500/15 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-orange-200/95">
                    {statusLabels[o.status]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {new Date(o.createdAt).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {o.lines
                  .filter((l) => menuById(l.menuItemId)?.station === station)
                  .map((l) => (
                    <li key={l.menuItemId} className="flex justify-between gap-2 text-slate-200">
                      <span>
                        {l.qty}× {l.name}
                      </span>
                      <span className="font-medium text-teal-200/90">{formatTry(l.unitPrice * l.qty)}</span>
                    </li>
                  ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {nextStatus[o.status] ? (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(o.id, nextStatus[o.status]!)}
                    className="font-display rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110"
                  >
                    → {statusLabels[nextStatus[o.status]!]}
                  </button>
                ) : null}
                {o.dbAck ? (
                  <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">
                    DB ✓
                  </span>
                ) : null}
                {o.posAck ? (
                  <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300">
                    POS ✓
                  </span>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
