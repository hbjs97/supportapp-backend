import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDuplicationDto {
  @ApiProperty({ type: 'enum', enum: ['email', 'phone'] })
  @IsString()
  readonly column!: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  readonly value!: string;
}
