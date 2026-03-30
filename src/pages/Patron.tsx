import { useMemo } from 'react';
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-200">
            <LayoutDashboard className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Patron özeti</h1>
            <p className="text-sm text-slate-500">{venue.name} — KPI ve basit analitik</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Toplam ciro (demo veri)
          </div>
          <div className="mt-1 text-2xl font-bold text-white">{formatTry(totalRevenue)}</div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Sipariş adedi
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-100">{orderCount}</div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            Ortalama sepet
          </div>
          <div className="mt-1 text-2xl font-bold text-cyan-200">{formatTry(avg)}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/70 p-5">
        <h2 className="text-sm font-semibold text-white">Son 7 gün — ciro</h2>
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
              <Bar dataKey="ciro" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
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
