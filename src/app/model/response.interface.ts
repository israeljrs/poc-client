import { IUser } from './user.interface';

export interface IResponse {
  status?: string;
  msg?: string;
  data?: IUser[];
}

export interface IResponseObj {
  status?: string;
  msg?: string;
  data?: IUser;
}
