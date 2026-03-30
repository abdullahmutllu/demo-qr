export const ORDER_BROADCAST_CHANNEL = 'demo-qr-order-sync';

export type OrderSyncPayload = {
  version: number;
  ordersJson: string;
  waiterJson: string;
  sourceTab: string;
};

let tabId: string | null = null;

export function getTabId(): string {
  if (!tabId) {
    tabId = `t-${Math.random().toString(36).slice(2, 11)}`;
  }
  return tabId;
}

export function openOrderBroadcastChannel(): BroadcastChannel {
  return new BroadcastChannel(ORDER_BROADCAST_CHANNEL);
}
