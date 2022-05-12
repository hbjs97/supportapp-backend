import { Order } from '../constants/order.enum';

export interface IQSearch {
  qColumnNames?: string[];

  q?: string;
}

export interface IOrder {
  orderColumnName: string;

  order: Order;
}
