import { Geometry } from 'geojson';
import { NumberField } from '../decorators';

export class GeoDto {
  @NumberField({ description: '위도' })
  readonly latitude!: number;

  @NumberField({ description: '경도' })
  readonly longitude!: number;

  get geo(): Geometry {
    return { type: 'Point', coordinates: [this.longitude, this.latitude] };
  }
}
