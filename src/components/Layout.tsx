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
    'relative flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-3 text-[13px] font-medium transition-all duration-200',
    isActive
      ? 'bg-white/[0.08] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(45,212,191,0.25),0_12px_28px_-16px_rgba(45,212,191,0.28)]'
      : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200',
  ].join(' ');
}

export default function Layout() {
  return (
    <div className="app-shell relative flex min-h-screen text-slate-100">
      <aside className="relative z-[1] flex w-[272px] shrink-0 flex-col border-r border-white/[0.07] bg-[#08090e]/90 shadow-[1px_0_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl">
        <div className="border-b border-white/[0.06] px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-500 to-violet-500 shadow-lg shadow-teal-500/25 ring-1 ring-white/20">
              <QrCode className="h-5 w-5 text-white drop-shadow-sm" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Hospitality
              </div>
              <div className="font-display truncate text-[15px] font-bold tracking-tight text-white">
                QR <span className="text-gradient-brand">Concierge</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
            Operasyon paneli — müşteri QR ekranı ile aynı sipariş akışını paylaşır. Çoklu sekme veya
            WebSocket ile senkron.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-teal-500/25 bg-teal-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-teal-200/90">
              v0 demo
            </span>
            <span className="text-[10px] text-slate-600">Enterprise-ready UI</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((g) => (
            <div key={g.title} className="mb-7">
              <div className="mb-2 px-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                {g.title}
              </div>
              <ul className="space-y-1">
                {g.items.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.end} className={navClass}>
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={[
                              'h-4 w-4 shrink-0 transition-colors',
                              isActive ? 'text-teal-300' : 'text-slate-600',
                            ].join(' ')}
                            aria-hidden
                          />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
