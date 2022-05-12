import { Order } from '../constants';
import { EnumFieldOptional, NumberFieldOptional, StringFieldOptional } from '../decorators';
import { IOrder, IQSearch } from '../interfaces/select.interface';

export class PageOptionsDto<T extends Array<string> = any, U extends string = any> implements IQSearch, IOrder {
  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  readonly order: Order = Order.ASC;

  @StringFieldOptional()
  readonly orderColumnName!: U;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;

  @StringFieldOptional({ isArray: true })
  readonly qColumnNames?: T;

  @StringFieldOptional()
  readonly q?: string;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
