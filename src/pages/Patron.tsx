import { useId, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LayoutDashboard, TrendingUp } from 'lucide-react';
import { formatTry } from '../lib/format';
import { useOrders } from '../context/OrderContext';
import { useVenueFilter } from '../context/VenueFilterContext';

function lastNDates(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}

export default function Patron() {
  const chartGradId = useId().replace(/:/g, '');
  const { orders } = useOrders();
  const { venue } = useVenueFilter();

  const scoped = useMemo(
    () => orders.filter((o) => o.venueId === venue.id),
    [orders, venue.id],
  );

  const totalRevenue = useMemo(() => scoped.reduce((s, o) => s + o.total, 0), [scoped]);
  const orderCount = scoped.length;
  const avg = orderCount > 0 ? totalRevenue / orderCount : 0;

  const chartData = useMemo(() => {
    const keys = lastNDates(7);
    const byDay: Record<string, number> = {};
    for (const o of scoped) {
      const day = o.createdAt.slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + o.total;
    }
    return keys.map((k) => ({
      day: k.slice(5),
      ciro: byDay[k] ?? 0,
      adet: scoped.filter((o) => o.createdAt.startsWith(k)).length,
    }));
  }, [scoped]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-600/15 text-emerald-100 ring-1 ring-white/10">
            <LayoutDashboard className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Patron özeti</h1>
            <p className="text-sm text-slate-500">{venue.name} · KPI ve analitik özeti</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface-panel rounded-3xl p-6">
          <div className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Toplam ciro
          </div>
          <div className="font-display mt-2 text-3xl font-extrabold tracking-tight text-white">
            {formatTry(totalRevenue)}
          </div>
          <p className="mt-1 text-[11px] text-slate-600">Demo veri · seçili mekan</p>
        </div>
        <div className="surface-panel rounded-3xl p-6">
          <div className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Sipariş
          </div>
          <div className="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-100">
            {orderCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-600">Adet</p>
        </div>
        <div className="surface-panel rounded-3xl p-6">
          <div className="flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <TrendingUp className="h-3.5 w-3.5 text-teal-400" aria-hidden />
            Ort. sepet
          </div>
          <div className="font-display mt-2 text-3xl font-extrabold tracking-tight text-teal-200">
            {formatTry(avg)}
          </div>
          <p className="mt-1 text-[11px] text-slate-600">Kişi başı tahmini</p>
        </div>
      </div>

      <div className="surface-panel rounded-3xl p-6 md:p-8">
        <h2 className="font-display text-sm font-bold text-white">Son 7 gün · ciro</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0c14',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [formatTry(Number(value ?? 0)), 'Ciro']}
              />
              <Bar dataKey="ciro" fill={`url(#${chartGradId})`} radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id={chartGradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Üretimde: PostgreSQL’ten rollup + gerçek zamanlı paneller; burada tarayıcıdaki demo
          siparişleri kullanılır.
        </p>
      </div>
    </div>
  );
}
