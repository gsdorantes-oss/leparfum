
export enum SaleType {
  FULL = 'FULL',
  ML10 = 'ML10',
  ML5 = 'ML5'
}

export enum PaymentMethod {
  CASH = 'Efectivo',
  TRANSFER = 'Transferencia',
  CARD = 'Tarjeta',
  YAPPY = 'Yappy'
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  total_ml: number;
  current_ml: number;
  price_full: number;
  price_10ml: number;
  price_5ml: number;
  stock_bottles: number;
  image_url?: string;
  last_sold_date?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Sale {
  id: string;
  perfume_id: string;
  perfume_name: string;
  customer_id: string;
  customer_name: string;
  type: SaleType;
  amount: number;
  price: number;
  payment_method: PaymentMethod;
  date: string;
}
