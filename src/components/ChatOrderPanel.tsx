import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Globe, Loader2, MessageCircle, Plus, Send, ShoppingBag } from 'lucide-react';
import type { Lang, MenuItem, OrderLine } from '../types/order';
import { mockAiRespond } from '../lib/aiMock';
import { menuItems } from '../data/menu';
import { formatTry } from '../lib/format';
import { fetchOpenAiProxyReply } from '../lib/chatApi';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  textTr: string;
  textEn: string;
  suggested?: MenuItem[];
  upsell?: MenuItem[];
};

function msgId() {
  return `m-${Math.random().toString(36).slice(2, 11)}`;
}

const inputClass =
  'min-w-0 flex-1 rounded-2xl border border-white/[0.1] bg-[#08090e]/90 px-4 py-3.5 text-sm text-white shadow-inner shadow-black/30 placeholder:text-slate-600 focus:border-teal-500/45 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

type Props = {
  venueId: string;
  venueName: string;
  tableId: string;
  lang: Lang;
  onLangChange: (l: Lang) => void;
};

export default function ChatOrderPanel({
  venueId,
  venueName,
  tableId,
  lang,
  onLangChange,
}: Props) {
  const { placeOrder } = useOrders();
  const { show } = useToast();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<OrderLine[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: msgId(),
      role: 'assistant',
      textTr: `Merhaba! ${venueName} — masa ${tableId}. Bugün deniz ürünü, kokteyl veya hafif başlangıç ister misiniz?`,
      textEn: `Hi! ${venueName} — table ${tableId}. Would you like seafood, cocktails, or a light starter today?`,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const hasProxy = Boolean(import.meta.env.VITE_OPENAI_PROXY_URL?.trim());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const cartTotal = useMemo(
    () => cart.reduce((s, l) => s + l.unitPrice * l.qty, 0),
    [cart],
  );

  const addToCart = useCallback((item: MenuItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.menuItemId === item.id);
      const name = lang === 'tr' ? item.nameTr : item.nameEn;
      if (existing) {
        return prev.map((x) =>
          x.menuItemId === item.id ? { ...x, qty: x.qty + qty } : x,
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name,
          qty,
          unitPrice: item.price,
        },
      ];
    });
  }, [lang]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg: ChatMessage = {
      id: msgId(),
      role: 'user',
      textTr: text,
      textEn: text,
    };
    const thread = [...messages, userMsg];
    setMessages(thread);
    setLoading(true);
    try {
      if (hasProxy) {
        try {
          const history = thread.map((x) => ({
            role: x.role === 'user' ? ('user' as const) : ('assistant' as const),
            content: lang === 'tr' ? x.textTr : x.textEn,
          }));
          const reply = await fetchOpenAiProxyReply([
            {
              role: 'system',
              content:
                'You are a concise restaurant ordering assistant. Reply in the same language as the user (Turkish or English). Suggest menu items briefly; this is a demo.',
            },
            ...history,
          ]);
          setMessages((m) => [
            ...m,
            {
              id: msgId(),
              role: 'assistant',
              textTr: reply,
              textEn: reply,
              suggested: menuItems.slice(0, 3),
            },
          ]);
        } catch {
          const mock = mockAiRespond(text, lang);
          setMessages((m) => [
            ...m,
            {
              id: msgId(),
              role: 'assistant',
              textTr: mock.replyTr,
              textEn: mock.replyEn,
              suggested: mock.suggestedItems,
              upsell: mock.upsellItems,
            },
          ]);
          show('API hatası — mock cevap gösterildi');
        }
      } else {
        await new Promise((r) => window.setTimeout(r, 550));
        const mock = mockAiRespond(text, lang);
        setMessages((m) => [
          ...m,
          {
            id: msgId(),
            role: 'assistant',
            textTr: mock.replyTr,
            textEn: mock.replyEn,
            suggested: mock.suggestedItems,
            upsell: mock.upsellItems,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [hasProxy, input, loading, messages, lang, show]);

  const submitOrder = useCallback(() => {
    if (cart.length === 0) {
      show(lang === 'tr' ? 'Sepet boş' : 'Cart is empty');
      return;
    }
    placeOrder({
      venueId,
      venueName,
      tableId,
      lines: cart,
      source: 'ai',
    });
    setCart([]);
    show(
      lang === 'tr'
        ? 'Sipariş kaydedildi — veritabanı ve POS (simülasyon) tamam.'
        : 'Order saved — DB & POS (simulated) OK.',
    );
    setMessages((m) => [
      ...m,
      {
        id: msgId(),
        role: 'assistant',
        textTr: 'Siparişiniz iletildi. Afiyet olsun! Başka bir şey ister misiniz?',
        textEn: 'Your order has been sent. Enjoy! Would you like anything else?',
      },
    ]);
  }, [cart, lang, placeOrder, show, tableId, venueId, venueName]);

  const displayText = (m: ChatMessage) => (lang === 'tr' ? m.textTr : m.textEn);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch">
      <section className="surface-panel flex min-h-[440px] flex-1 flex-col overflow-hidden rounded-3xl">
        <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.06] bg-gradient-to-r from-teal-500/[0.06] via-transparent to-violet-500/[0.05] px-5 py-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/25 to-violet-500/20 text-teal-100 ring-1 ring-white/12">
              <Bot className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-white">Concierge</div>
              <div className="text-[11px] font-medium text-slate-500">
                {hasProxy ? 'OpenAI proxy · canlı' : 'Mock · anahtar kelime eşlemesi'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onLangChange(lang === 'tr' ? 'en' : 'tr')}
            className="font-display inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-black/30 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-200 transition hover:border-teal-500/35 hover:bg-teal-500/10"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden />
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={[
                'flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-lg shadow-black/20',
                m.role === 'user'
                  ? 'ml-6 border-teal-500/25 bg-gradient-to-br from-teal-500/12 to-cyan-500/5 text-slate-100'
                  : 'mr-2 border-white/[0.07] bg-[#0c0e14]/85 text-slate-200',
              ].join(' ')}
            >
              {m.role === 'assistant' ? (
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-300/90" aria-hidden />
              ) : null}
              <div className="min-w-0 flex-1">
                <p>{displayText(m)}</p>
                {m.role === 'assistant' && (m.suggested?.length || m.upsell?.length) ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.suggested?.map((item) => (
                      <button
                        key={`s-${item.id}`}
                        type="button"
                        onClick={() => addToCart(item)}
                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/35 bg-emerald-500/[0.12] px-2.5 py-1.5 text-[11px] font-semibold text-emerald-100 transition hover:border-emerald-400/50 hover:bg-emerald-500/20"
                      >
                        <Plus className="h-3 w-3" aria-hidden />
                        {lang === 'tr' ? item.nameTr : item.nameEn}{' '}
                        <span className="text-emerald-300/90">{formatTry(item.price)}</span>
                      </button>
                    ))}
                    {m.upsell?.map((item) => (
                      <button
                        key={`u-${item.id}`}
                        type="button"
                        onClick={() => addToCart(item)}
                        className="inline-flex items-center gap-1 rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-100 transition hover:from-amber-500/25 hover:to-orange-500/15"
                      >
                        <Plus className="h-3 w-3" aria-hidden />
                        {lang === 'tr' ? 'Öneri: ' : 'Upsell: '}
                        {lang === 'tr' ? item.nameTr : item.nameEn}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2 text-xs font-medium text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-teal-400" aria-hidden />
              {lang === 'tr' ? 'Asistan yazıyor…' : 'Assistant is typing…'}
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/[0.06] bg-[#08090e]/50 p-4">
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder={
                lang === 'tr'
                  ? 'Örn: levrek, Aperol veya kalamar…'
                  : "e.g. sea bass, Aperol, or calamari…"
              }
              aria-label={lang === 'tr' ? 'Mesaj' : 'Message'}
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading || !input.trim()}
              className="font-display inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:brightness-110 disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden />
              {lang === 'tr' ? 'Gönder' : 'Send'}
            </button>
          </div>
        </div>
      </section>

      <aside className="surface-panel flex w-full shrink-0 flex-col overflow-hidden rounded-3xl lg:w-[340px]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-5 py-4">
          <ShoppingBag className="h-4 w-4 text-teal-300" aria-hidden />
          <span className="font-display text-sm font-bold text-white">
            {lang === 'tr' ? 'Sepet' : 'Cart'}
          </span>
          <span className="ml-auto rounded-full bg-white/[0.06] px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {lang === 'tr' ? 'Masa' : 'Tbl'} {tableId}
          </span>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <p className="text-sm leading-relaxed text-slate-500">
              {lang === 'tr'
                ? 'Sohbetten + ile yemek veya içecek ekleyin.'
                : 'Add items from chat suggestions with +.'}
            </p>
          ) : (
            cart.map((line) => (
              <div
                key={line.menuItemId}
                className="flex items-center justify-between gap-2 rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3 text-sm shadow-inner shadow-black/20"
              >
                <span className="min-w-0 truncate font-medium text-slate-200">
                  {line.qty}× {line.name}
                </span>
                <span className="shrink-0 font-display font-semibold text-teal-200/95">
                  {formatTry(line.unitPrice * line.qty)}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-white/[0.06] bg-gradient-to-t from-emerald-500/[0.04] to-transparent p-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-400">{lang === 'tr' ? 'Ara toplam' : 'Subtotal'}</span>
            <span className="font-display text-lg font-bold text-white">{formatTry(cartTotal)}</span>
          </div>
          <button
            type="button"
            onClick={submitOrder}
            disabled={cart.length === 0}
            className="font-display w-full rounded-2xl border border-emerald-400/35 bg-gradient-to-r from-emerald-500/25 to-teal-600/20 py-3.5 text-sm font-bold text-emerald-50 shadow-lg shadow-emerald-500/10 transition hover:brightness-110 disabled:opacity-40"
          >
            {lang === 'tr' ? 'Siparişi gönder' : 'Submit order'}
          </button>
        </div>
      </aside>

      <section className="rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.03] p-4 lg:hidden">
        <div className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {lang === 'tr' ? 'Hızlı menü' : 'Quick menu'}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {menuItems.slice(0, 6).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addToCart(item)}
              className="rounded-xl border border-white/[0.1] bg-black/20 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-teal-500/35 hover:text-white"
            >
              + {lang === 'tr' ? item.nameTr : item.nameEn}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
