import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Token } from '../types';

export class TokenPayloadDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  accessToken: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  refreshToken: string;

  constructor(token: Token) {
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
  }
}
