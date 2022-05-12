import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ type: 'string', default: 'test@naver.com', required: true })
  @IsString()
  readonly email!: string;

  @ApiProperty({ type: 'string', default: '1234', required: true })
  @IsString()
  readonly password!: string;
}
