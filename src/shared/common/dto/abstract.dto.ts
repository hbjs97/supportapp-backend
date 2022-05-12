import { ApiProperty } from '@nestjs/swagger';
import type { AbstractEntity } from 'src/shared/entities/abstract.entity';

export class AbstractDto {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt: Date | null;

  @ApiProperty({ required: false })
  deletedAt: Date | null;

  constructor(entity: AbstractEntity) {
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
  }
}
