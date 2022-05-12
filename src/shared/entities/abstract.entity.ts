import type { AbstractDto } from 'src/shared/common/dto/abstract.dto';
import type { Constructor } from 'src/types';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { IAbstractEntity } from '../common/interfaces/abstract-entity.interface';

export abstract class AbstractEntity<DTO extends AbstractDto = AbstractDto, O = never> implements IAbstractEntity<DTO, O> {
  @CreateDateColumn({ name: 'created_at', comment: '생성일' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '수정일' })
  updatedAt!: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', comment: '삭제일' })
  deletedAt!: Date | null;

  private dtoClass!: Constructor<DTO, [AbstractEntity, O?]>;

  public toDto(options?: O): DTO {
    const { dtoClass } = this;

    if (!dtoClass) {
      throw new Error(`You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`);
    }

    // eslint-disable-next-line new-cap
    return new this.dtoClass(this, options);
  }
}
