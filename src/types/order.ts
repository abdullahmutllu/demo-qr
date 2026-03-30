export type Lang = 'tr' | 'en';

export type Station = 'kitchen' | 'bar';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served';

export interface MenuItem {
  id: string;
  nameTr: string;
  nameEn: string;
  price: number;
  categoryTr: string;
  categoryEn: string;
  station: Station;
  /** keywords for mock AI matching (lowercase) */
  keywords: string[];
  upsellIds?: string[];
}

export interface OrderLine {
  menuItemId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  venueId: string;
  venueName: string;
  tableId: string;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  source: 'ai' | 'manual';
  posAck?: boolean;
  dbAck?: boolean;
}

export interface WaiterNotification {
  id: string;
  orderId: string;
  venueName: string;
  tableId: string;
  messageTr: string;
  messageEn: string;
  read: boolean;
  createdAt: string;
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  city: string;
}
