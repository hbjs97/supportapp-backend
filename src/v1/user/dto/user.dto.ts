import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/shared/common/constants';
import { AbstractDto } from 'src/shared/common/dto';
import type { UserEntity } from 'src/shared/entities/user.entity';

export class UserDto extends AbstractDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  role: Role;

  constructor(user: UserEntity) {
    super(user);
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.role = user.role;
  }
}
