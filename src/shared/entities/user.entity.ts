import { Role } from 'src/shared/common/constants';
import { UserDto } from 'src/v1/user/dto/user.dto';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PlainRole } from '../common/constants';
import { UseDto } from '../common/decorators/use-dto.decorator';
import { AbstractEntity } from './abstract.entity';
import { BookmarkEntity } from './bookmark.entity';
import { MallEntity } from './mall.entity';

@Entity('user')
@Unique('UK_e12875dfb3b1d92d7d7c5377e2', ['email'])
@Unique('UK_8e1f623798118e629b46a9e629', ['phone'])
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'email', length: 100 })
  email!: string;

  @Column('varchar', { name: 'password', length: 255 })
  password!: string;

  @Column('varchar', { name: 'name', length: 50 })
  name!: string;

  @Column('varchar', { name: 'phone', length: 13 })
  phone!: string;

  @Column('enum', { name: 'role', enum: PlainRole })
  role!: Role;

  @OneToMany(() => MallEntity, (mall) => mall.user)
  malls!: MallEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user)
  bookmarks!: BookmarkEntity[];
}
