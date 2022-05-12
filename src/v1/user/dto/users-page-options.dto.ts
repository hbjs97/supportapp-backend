import { EnumFieldOptional, StringFieldOptional } from 'src/shared/common';
import { Order } from 'src/shared/common/constants';
import { PageOptionsDto } from 'src/shared/common/dto';
import { OrderableUserColumns, QSearchableUserColumns } from '../constants/select.enum';

export class UsersPageOptionsDto extends PageOptionsDto {
  @EnumFieldOptional(() => Order, { default: Order.ASC })
  override readonly order: Order = Order.ASC;

  @StringFieldOptional({ enum: OrderableUserColumns })
  override readonly orderColumnName!: OrderableUserColumns;

  @StringFieldOptional({ isArray: true, enum: QSearchableUserColumns })
  override readonly qColumnNames!: Array<QSearchableUserColumns>;

  @StringFieldOptional()
  override readonly q!: string;
}
