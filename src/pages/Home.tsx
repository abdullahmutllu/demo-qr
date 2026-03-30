import { Link } from 'react-router-dom';
import { ExternalLink, Layers, MonitorSmartphone, QrCode, Sparkles } from 'lucide-react';
import { venues } from '../data/venues';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const { orders, clearDemoData } = useOrders();
  const { show } = useToast();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-600/10 p-6 md:p-8">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-200">
            <Sparkles className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Müşteri demosu — QR → AI → mutfak → patron
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Bu ortam <strong className="text-slate-300">simülasyondur</strong>: veritabanı ve POS gerçek
              entegrasyon yerine onaylı mock kullanır. İki sekme açıp müşteri QR ile aynı siparişi mutfak
              veya patron ekranında canlı görebilirsiniz (BroadcastChannel veya opsiyonel WebSocket).
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/v/bora-beach/m/7"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25"
          >
            <QrCode className="h-4 w-4" aria-hidden />
            Örnek: Bora Beach — masa 7
          </Link>
          <Link
            to="/patron"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/[0.07]"
          >
            <MonitorSmartphone className="h-4 w-4" aria-hidden />
            Patron paneli
          </Link>
          <button
            type="button"
            onClick={() => {
              clearDemoData();
              show('Tüm demo siparişleri sıfırlandı');
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-slate-400 hover:border-red-500/30 hover:text-red-300"
          >
            Veriyi temizle
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          <Layers className="h-4 w-4" aria-hidden />
          Mekanlar (çoklu lokasyon)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <div
              key={v.id}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#0c0c14]/60 p-5"
            >
              <div className="text-base font-semibold text-white">{v.name}</div>
              <div className="text-xs text-slate-500">{v.city}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/v/${v.slug}/m/5`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Müşteri QR <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                </Link>
                <Link to="/mutfak" className="text-xs font-medium text-slate-400 hover:text-slate-200">
                  KDS
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#0a0a10]/80 px-4 py-3 text-sm text-slate-500">
        Toplam kayıtlı sipariş (local):{' '}
        <span className="font-mono text-slate-300">{orders.length}</span>
      </div>
    </div>
  );
}
