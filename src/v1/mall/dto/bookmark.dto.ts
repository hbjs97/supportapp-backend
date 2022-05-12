import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/shared/common/dto';
import { BookmarkEntity } from 'src/shared/entities/bookmark.entity';
import { UserDto } from 'src/v1/user/dto/user.dto';
import { MallDto } from './mall.dto';

export class BookmarkDto extends AbstractDto {
  @ApiProperty()
  mall: MallDto;

  @ApiProperty()
  user: UserDto;

  constructor(bookmark: BookmarkEntity) {
    super(bookmark);
    this.mall = bookmark.mall?.toDto();
    this.user = bookmark.user?.toDto();
  }
}
