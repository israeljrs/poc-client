import { IUser } from './user.interface';

export interface IOrder {
  id?: number;
  user_id?: number;
  model?: string;
  vrl_year?: number;
  num_parcel?: number;
}

export interface IResOrders {
  status?: string;
  msg?: string;
  user?: IUser;
  orders?: IOrder[];
}

export interface IResOrder {
  status?: string;
  msg?: string;
  data?: IOrder;
}
