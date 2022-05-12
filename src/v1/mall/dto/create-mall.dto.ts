import { PhoneField, StringField, StringFieldOptional } from 'src/shared/common';
import { GeoDto } from 'src/shared/common/dto/geo.dto';

export class CreateMallDto extends GeoDto {
  @StringField()
  name!: string;

  @PhoneField()
  phone!: string;

  @StringField()
  address!: string;

  @StringFieldOptional()
  addressDetail!: string;

  @StringFieldOptional()
  remark!: string;

  @StringFieldOptional({ description: 'HH:MM' })
  openAt!: string;

  @StringFieldOptional({ description: 'HH:MM' })
  closeAt!: string;
}
