import type { AbstractDto } from '../dto';

export interface IAbstractEntity<DTO extends AbstractDto, O = never> {
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;

  toDto(options?: O): DTO;
}
