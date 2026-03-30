import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Martini,
  QrCode,
  Settings2,
  UtensilsCrossed,
  ConciergeBell,
} from 'lucide-react';
import AppHeader from './AppHeader';

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Genel',
    items: [
      { to: '/', label: 'Başlangıç', icon: LayoutDashboard, end: true },
      { to: '/patron', label: 'Patron özeti', icon: QrCode },
    ],
  },
  {
    title: 'Operasyon',
    items: [
      { to: '/mutfak', label: 'Mutfak', icon: UtensilsCrossed },
      { to: '/bar', label: 'Bar', icon: Martini },
      { to: '/garson', label: 'Garson', icon: ConciergeBell },
    ],
  },
  {
    title: 'Yönetim',
    items: [{ to: '/admin', label: 'Mekan / menü', icon: Settings2 }],
  },
];

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'group flex items-center gap-3 rounded-r-lg border-l-2 py-2.5 pl-3 pr-3 text-sm font-medium transition-all',
    isActive
      ? 'border-cyan-400 bg-gradient-to-r from-cyan-500/15 to-transparent text-white shadow-[inset_0_0_24px_rgba(34,211,238,0.06)]'
      : 'border-transparent text-slate-400 hover:border-slate-600 hover:bg-white/[0.04] hover:text-slate-200',
  ].join(' ');
}

export default function Layout() {
  return (
    <div className="app-shell flex min-h-screen text-slate-100">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0a0a10]">
        <div className="border-b border-white/[0.06] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20">
              <QrCode className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Beach & restoran
              </div>
              <div className="truncate text-base font-bold tracking-tight text-white">
                QR <span className="text-cyan-400">Sipariş AI</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Çoklu sekme: müşteri + mutfak + patron aynı siparişi görür (BroadcastChannel / isteğe
            bağlı WebSocket).
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {groups.map((g) => (
            <div key={g.title} className="mb-6">
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                {g.title}
              </div>
              <ul className="space-y-0.5">
                {g.items.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.end} className={navClass}>
                      <item.icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
