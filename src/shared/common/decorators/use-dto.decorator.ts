import type { AbstractEntity } from 'src/shared/entities/abstract.entity';
import type { Constructor } from 'src/types';
import type { AbstractDto } from '../dto';

export function UseDto(dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
