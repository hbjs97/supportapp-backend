import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserLoginPayload } from '../types';

export class TokenizedUserPayloadDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  id: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  role: string;

  constructor(userLoginPayload: UserLoginPayload) {
    this.id = userLoginPayload.id;
    this.name = userLoginPayload.name;
    this.email = userLoginPayload.email;
    this.role = userLoginPayload.role;
  }
}
