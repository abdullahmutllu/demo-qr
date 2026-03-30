import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Order, OrderLine, OrderStatus, WaiterNotification } from '../types/order';
import {
  getTabId,
  openOrderBroadcastChannel,
  type OrderSyncPayload,
} from '../lib/orderBroadcast';

const STORAGE_ORDERS = 'demo-qr-orders';
const STORAGE_WAITER = 'demo-qr-waiter';

function loadJson<T>(key: string, fallback: T): T {
  try {
    const r = localStorage.getItem(key);
    if (!r) return fallback;
    return JSON.parse(r) as T;
  } catch {
    return fallback;
  }
}

function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type PlaceOrderInput = {
  venueId: string;
  venueName: string;
  tableId: string;
  lines: OrderLine[];
  source: 'ai' | 'manual';
};

type Bundle = { orders: Order[]; waiterInbox: WaiterNotification[] };

type OrderContextValue = {
  orders: Order[];
  waiterInbox: WaiterNotification[];
  placeOrder: (input: PlaceOrderInput) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markWaiterRead: (id: string) => void;
  clearDemoData: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

function wsUrlFromEnv(): string | undefined {
  const raw = import.meta.env.VITE_WS_URL?.trim();
  if (!raw) return undefined;
  try {
    const u = new URL(raw, window.location.origin);
    const isSecure = u.protocol === 'https:' || u.protocol === 'wss:';
    u.protocol = isSecure ? 'wss:' : 'ws:';
    return u.toString().replace(/\/$/, '');
  } catch {
    return raw.startsWith('ws') ? raw : `ws://${raw}`;
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState<Bundle>(() => ({
    orders: loadJson(STORAGE_ORDERS, []),
    waiterInbox: loadJson(STORAGE_WAITER, []),
  }));
  const versionRef = useRef(0);
  const tabIdRef = useRef(getTabId());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const applyRemoteSync = useCallback((payload: OrderSyncPayload) => {
    if (payload.sourceTab === tabIdRef.current) return;
    const next: Bundle = {
      orders: JSON.parse(payload.ordersJson) as Order[],
      waiterInbox: JSON.parse(payload.waiterJson) as WaiterNotification[],
    };
    setBundle(next);
    localStorage.setItem(STORAGE_ORDERS, payload.ordersJson);
    localStorage.setItem(STORAGE_WAITER, payload.waiterJson);
  }, []);

  const pushSync = useCallback((next: Bundle) => {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(next.orders));
    localStorage.setItem(STORAGE_WAITER, JSON.stringify(next.waiterInbox));
    versionRef.current += 1;
    const payload: OrderSyncPayload = {
      version: versionRef.current,
      ordersJson: JSON.stringify(next.orders),
      waiterJson: JSON.stringify(next.waiterInbox),
      sourceTab: tabIdRef.current,
    };
    channelRef.current?.postMessage(payload);
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'sync', ...payload }));
    }
  }, []);

  useEffect(() => {
    const ch = openOrderBroadcastChannel();
    channelRef.current = ch;
    ch.onmessage = (ev: MessageEvent<OrderSyncPayload>) => {
      applyRemoteSync(ev.data);
    };
    return () => {
      ch.close();
      channelRef.current = null;
    };
  }, [applyRemoteSync]);

  useEffect(() => {
    const url = wsUrlFromEnv();
    if (!url) return;
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${url}/ws/orders`);
    } catch {
      return;
    }
    wsRef.current = ws;
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as OrderSyncPayload & { type?: string };
        if (data.type !== 'sync' || typeof data.ordersJson !== 'string') return;
        applyRemoteSync(data);
      } catch {
        /* ignore */
      }
    };
    return () => {
      ws.close();
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, [applyRemoteSync]);

  const placeOrder = useCallback(
    (input: PlaceOrderInput): Order => {
      const total = input.lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
      const order: Order = {
        id: genId(),
        venueId: input.venueId,
        venueName: input.venueName,
        tableId: input.tableId,
        lines: input.lines,
        total,
        status: 'new',
        createdAt: new Date().toISOString(),
        source: input.source,
        dbAck: true,
        posAck: true,
      };
      const note: WaiterNotification = {
        id: genId(),
        orderId: order.id,
        venueName: input.venueName,
        tableId: input.tableId,
        messageTr: `Masa ${input.tableId}: yeni sipariş (${input.lines.length} kalem)`,
        messageEn: `Table ${input.tableId}: new order (${input.lines.length} items)`,
        read: false,
        createdAt: order.createdAt,
      };
      setBundle((b) => {
        const next: Bundle = {
          orders: [order, ...b.orders],
          waiterInbox: [note, ...b.waiterInbox],
        };
        pushSync(next);
        return next;
      });
      return order;
    },
    [pushSync],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setBundle((b) => {
        const next: Bundle = {
          ...b,
          orders: b.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        };
        pushSync(next);
        return next;
      });
    },
    [pushSync],
  );

  const markWaiterRead = useCallback(
    (id: string) => {
      setBundle((b) => {
        const next: Bundle = {
          ...b,
          waiterInbox: b.waiterInbox.map((n) => (n.id === id ? { ...n, read: true } : n)),
        };
        pushSync(next);
        return next;
      });
    },
    [pushSync],
  );

  const clearDemoData = useCallback(() => {
    const empty: Bundle = { orders: [], waiterInbox: [] };
    setBundle(empty);
    pushSync(empty);
  }, [pushSync]);

  const value = useMemo(
    () => ({
      orders: bundle.orders,
      waiterInbox: bundle.waiterInbox,
      placeOrder,
      updateOrderStatus,
      markWaiterRead,
      clearDemoData,
    }),
    [bundle.orders, bundle.waiterInbox, placeOrder, updateOrderStatus, markWaiterRead, clearDemoData],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrders OrderProvider içinde kullanılmalıdır.');
  }
  return ctx;
}
