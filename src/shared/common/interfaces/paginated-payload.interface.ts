import { IListPayload } from './list-payload.interface';

export interface IPaginatedPayload<T> extends IListPayload<T> {
  page: number;
  maxPage: number;
}
