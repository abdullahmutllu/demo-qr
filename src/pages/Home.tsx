import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Layers,
  MonitorSmartphone,
  QrCode,
  Radio,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { venues } from '../data/venues';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

const flow = [
  { step: '01', title: 'QR & masa', detail: 'Misafir kodu okutur, mekan ve masa bağlanır.', icon: QrCode },
  { step: '02', title: 'AI concierge', detail: 'TR/EN sohbet, öneri ve upsell ile sepet oluşur.', icon: Sparkles },
  { step: '03', title: 'Mutfak & bar', detail: 'KDS, garson ve patron paneli anında güncellenir.', icon: UtensilsCrossed },
];

export default function Home() {
  const { orders, clearDemoData } = useOrders();
  const { show } = useToast();

  return (
    <div className="relative mx-auto max-w-5xl space-y-12">
      <section className="surface-panel relative overflow-hidden rounded-3xl p-1">
        <div
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-violet-500/12 blur-3xl"
          aria-hidden
        />
        <div className="relative rounded-[1.35rem] border border-white/[0.05] bg-[#0a0c12]/85 px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-teal-300/85">
                Beach club · fine dining · bar
              </p>
              <h1 className="font-display mt-3 text-3xl font-extrabold leading-[1.15] tracking-tight text-white md:text-4xl">
                QR ile açılan{' '}
                <span className="text-gradient-brand">AI sipariş deneyimi</span>
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
                Misafir tarafında akıllı asistan, operasyonda KDS ve patron içgörüleri — tek akışta.
                Bu kurulum <strong className="font-medium text-slate-200">yüksek güvenilirlikli bir demo</strong>
                ’dur; veriler tarayıcıda tutulur, gerçek POS/DB NDA sonrası bağlanır.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/v/bora-beach/m/7"
                  className="font-display inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-teal-500/20 transition hover:brightness-110"
                >
                  <QrCode className="h-4 w-4" aria-hidden />
                  Canlı: Bora Beach · masa 7
                  <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
                </Link>
                <Link
                  to="/patron"
                  className="font-display inline-flex items-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/[0.18] hover:bg-white/[0.07]"
                >
                  <MonitorSmartphone className="h-4 w-4 text-teal-300" aria-hidden />
                  Patron özeti
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    clearDemoData();
                    show('Demo verisi sıfırlandı');
                  }}
                  className="rounded-2xl border border-white/[0.08] px-4 py-3 text-sm font-medium text-slate-500 transition hover:border-red-400/35 hover:text-red-300"
                >
                  Veriyi sıfırla
                </button>
              </div>
            </div>
            <div className="surface-panel-subtle w-full max-w-sm shrink-0 rounded-2xl p-5 lg:mt-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <Radio className="h-3.5 w-3.5 text-teal-400" aria-hidden />
                Canlı senkron
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Aynı tarayıcıda müşteri + mutfak + patron sekmelerini açın; sipariş anında diğer
                ekranlara düşer.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-black/30 px-3 py-3">
                  <div className="font-display text-2xl font-bold text-white">{orders.length}</div>
                  <div className="text-[11px] text-slate-500">Kayıtlı sipariş</div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-black/30 px-3 py-3">
                  <div className="font-display text-2xl font-bold text-teal-300">∞</div>
                  <div className="text-[11px] text-slate-500">Çoklu mekan</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 border-t border-white/[0.06] pt-8 md:grid-cols-3">
            {flow.map((f) => (
              <div
                key={f.step}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-teal-500/25 hover:bg-teal-500/[0.04]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-violet-500/15 text-teal-200 ring-1 ring-white/10">
                    <f.icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-[10px] font-bold text-slate-600">{f.step}</div>
                    <div className="font-display text-sm font-bold text-white">{f.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-5 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          <Layers className="h-4 w-4 text-teal-400" aria-hidden />
          Çoklu lokasyon
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v, i) => {
            const bar = [
              'from-teal-500 to-cyan-400',
              'from-violet-500 to-fuchsia-400',
              'from-amber-500 to-orange-400',
            ][i % 3];
            return (
            <div
              key={v.id}
              className="surface-panel group relative overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.5"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${bar}`} aria-hidden />
              <div className="p-5">
                <div className="font-display text-lg font-bold text-white">{v.name}</div>
                <div className="mt-0.5 text-xs font-medium text-slate-500">{v.city}</div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to={`/v/${v.slug}/m/5`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/[0.08] transition hover:bg-teal-500/15 hover:ring-teal-500/30"
                  >
                    Müşteri QR
                    <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                  </Link>
                  <Link
                    to="/mutfak"
                    className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-white/[0.14] hover:text-white"
                  >
                    KDS aç
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
