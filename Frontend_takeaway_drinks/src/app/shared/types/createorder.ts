export type CreateOrderItem = {
  product_id: number;
  quantity: number;
}

export type CreateOrder = {
  items: CreateOrderItem[];
}