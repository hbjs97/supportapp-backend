import { OmitType, PartialType } from '@nestjs/swagger';
import { Geometry } from 'geojson';
import { CreateMallDto } from './create-mall.dto';

export class UpdateMallDto extends PartialType(OmitType(CreateMallDto, ['geo'] as const)) {
  get geo(): Geometry | undefined {
    if (this.longitude && this.latitude) return { type: 'Point', coordinates: [this.longitude, this.latitude] };
  }
}
