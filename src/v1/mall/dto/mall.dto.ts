import { ApiProperty } from '@nestjs/swagger';
import { Geometry } from 'geojson';
import { AbstractDto } from 'src/shared/common/dto';
import { MallEntity } from 'src/shared/entities/mall.entity';
import { UserDto } from 'src/v1/user/dto/user.dto';

export class MallDto extends AbstractDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  lat?: number;

  @ApiProperty()
  lng?: number;

  @ApiProperty()
  geo: Geometry;

  @ApiProperty()
  address: string;

  @ApiProperty()
  addressDetail: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  openAt: string;

  @ApiProperty()
  closeAt: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  isOpen: number;

  @ApiProperty()
  isBookmark: number;

  constructor(mall: MallEntity) {
    super(mall);
    this.id = mall.id;
    this.user = mall.user?.toDto();
    this.name = mall.name;
    this.phone = mall.phone;
    this.lng = mall.geo.type === 'Point' ? mall.geo.coordinates[0] : undefined;
    this.lat = mall.geo.type === 'Point' ? mall.geo.coordinates[1] : undefined;
    this.geo = mall.geo;
    this.address = mall.address;
    this.addressDetail = mall.addressDetail;
    this.remark = mall.remark;
    this.openAt = mall.openAt;
    this.closeAt = mall.closeAt;
    this.thumbnail = mall.thumbnail;
    this.isOpen = mall.isOpen;
    this.isBookmark = +!!mall.bookmarks?.length;
  }
}
