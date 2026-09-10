import { OrderItems } from './orderitem';

export type Order = {
  id: number;
  order_code: string;
  total_amount: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  created_at: string;
  items: OrderItems[];
}