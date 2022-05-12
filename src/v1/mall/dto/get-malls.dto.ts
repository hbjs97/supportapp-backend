import { StringFieldOptional } from 'src/shared/common';

export class GetMallsDto {
  @StringFieldOptional({ description: '매장명 q' })
  readonly q!: string;
}
