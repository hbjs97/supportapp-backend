import { Geometry } from 'geojson';
import { GeometryTransformer } from 'src/shared/common/transformers/GeometryTransformer';
import { MallDto } from 'src/v1/mall/dto/mall.dto';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VirtualColumn } from '../common';
import { UseDto } from '../common/decorators/use-dto.decorator';
import { AbstractEntity } from './abstract.entity';
import { BookmarkEntity } from './bookmark.entity';
import { UserEntity } from './user.entity';

@Entity('mall')
@UseDto(MallDto)
export class MallEntity extends AbstractEntity<MallDto> {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column('varchar', { name: 'created_by', length: 36 })
  createdBy!: string;

  @Index()
  @Column('varchar', { name: 'name', length: 255 })
  name!: string;

  @Column('varchar', { name: 'phone', length: 13 })
  phone!: string;

  @Index()
  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326, transformer: new GeometryTransformer() })
  geo!: Geometry;

  @Column('varchar', { name: 'address', length: 255 })
  address!: string;

  @Column('varchar', { name: 'address_detail', length: 255, nullable: true })
  addressDetail!: string;

  @Column('varchar', { name: 'remark', length: 600, nullable: true })
  remark!: string;

  @Column('varchar', { name: 'open_at', length: 5, nullable: true })
  openAt!: string;

  @Column('varchar', { name: 'close_at', length: 5, nullable: true })
  closeAt!: string;

  @Column('varchar', { name: 'thumbnail', length: 600, nullable: true })
  thumbnail!: string;

  @VirtualColumn()
  isOpen!: number;

  @ManyToOne(() => UserEntity, (user) => user.malls, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'id' }])
  user!: UserEntity;

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.mall)
  bookmarks!: BookmarkEntity[];
}
