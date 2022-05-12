import { BookmarkDto } from 'src/v1/mall/dto/bookmark.dto';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UseDto } from '../common/decorators/use-dto.decorator';
import { AbstractEntity } from './abstract.entity';
import { MallEntity } from './mall.entity';
import { UserEntity } from './user.entity';

@Entity('bookmark')
@UseDto(BookmarkDto)
export class BookmarkEntity extends AbstractEntity<BookmarkDto> {
  @Column('varchar', { name: 'created_by', length: 36, primary: true })
  createdBy!: string;

  @Column('bigint', { name: 'mall_id', primary: true })
  mallId!: string;

  @ManyToOne(() => UserEntity, (user) => user.bookmarks, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'id' }])
  user!: UserEntity;

  @ManyToOne(() => MallEntity, (mall) => mall.bookmarks, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'mall_id', referencedColumnName: 'id' }])
  mall!: MallEntity;
}
