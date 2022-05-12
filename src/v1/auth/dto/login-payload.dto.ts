import { ApiProperty } from '@nestjs/swagger';
import { TokenPayloadDto } from './token-payload.dto';
import { TokenizedUserPayloadDto } from './tokenized-user-payload.dto';

export class LoginPayloadDto {
  @ApiProperty()
  tokenizedUserPayloadDto: TokenizedUserPayloadDto;

  @ApiProperty()
  tokenPayload: TokenPayloadDto;

  constructor(tokenizedUserPayloadDto: TokenizedUserPayloadDto, tokenPayload: TokenPayloadDto) {
    this.tokenizedUserPayloadDto = tokenizedUserPayloadDto;
    this.tokenPayload = tokenPayload;
  }
}
