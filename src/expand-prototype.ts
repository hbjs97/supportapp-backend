import 'source-map-support/register';
/* eslint-disable no-extend-native */
/* eslint-disable @typescript-eslint/naming-convention,sonarjs/cognitive-complexity */

import { HttpException, HttpStatus } from '@nestjs/common';
import { castArray, compact, map } from 'lodash';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { VIRTUAL_COLUMN_KEY } from './shared/common/decorators/virtual-column.decorator';
import { PageOptionsDto } from './shared/common/dto';
import type { AbstractDto } from './shared/common/dto/abstract.dto';
import { PageMetaDto } from './shared/common/dto/page-meta.dto';
import { PageDto } from './shared/common/dto/page.dto';
import type { AbstractEntity } from './shared/entities/abstract.entity';

declare global {
  interface Array<T> {
    isEmpty<T>(this: T[]): boolean;

    notNull<T>(this: T[], message?: string): void;

    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[];

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      // FIXME make option type visible from entity
      options?: unknown,
    ): PageDto<Dto>;

    toPageRawDto<RawDto extends AbstractDto>(this: T[], pageMetaDto: PageMetaDto): PageDto<RawDto>;
  }
  interface String {
    toJson(): Record<string, unknown>;
  }
}

Array.prototype.isEmpty = function (): boolean {
  return !!this.length;
};

Array.prototype.notNull = function (message?: string): void {
  if (this.length === 0) {
    throw new HttpException(message || 'array not null exception', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

Array.prototype.toDtos = function <Entity extends AbstractEntity<Dto>, Dto extends AbstractDto>(options?: unknown): Dto[] {
  return compact(map<Entity, Dto>(this as Entity[], (item) => item.toDto(options as never)));
};

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto, options?: unknown) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

Array.prototype.toPageRawDto = function (pageMetaDto: PageMetaDto) {
  return new PageDto(this, pageMetaDto);
};

String.prototype.toJson = function () {
  try {
    return JSON.parse(this.toString());
  } catch (error: any) {
    throw new HttpException('string to json parse failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

declare module 'typeorm' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface QueryBuilder<Entity> {
    searchByString(q: string, columnNames: string[], alias?: string): this;
  }

  interface SelectQueryBuilder<Entity> {
    paginate(this: SelectQueryBuilder<Entity>, pageOptionsDto: PageOptionsDto, options?: Partial<{ takeAll: boolean }>): Promise<[Entity[], PageMetaDto]>;
    paginateRaw<RawDTO>(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean }>,
    ): Promise<[RawDTO[], PageMetaDto]>;

    getMany(this: SelectQueryBuilder<Entity>): Promise<Entity[]>;
    getOne(this: SelectQueryBuilder<Entity>): Promise<Entity | undefined>;
    getOneOrFail(this: SelectQueryBuilder<Entity>): Promise<Entity>;
  }
}

SelectQueryBuilder.prototype.searchByString = function (q: string, columnNames: string[], alias: string = '') {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${alias ? alias.concat('.') : alias}${item} LIKE :q`, { q: `%${q}%` });
      }
    }),
  );

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (pageOptionsDto: PageOptionsDto, options?: Partial<{ takeAll: boolean }>) {
  const alias = this.expressionMap.mainAlias;

  if (!options?.takeAll) {
    this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
  }

  if (pageOptionsDto?.q && pageOptionsDto.qColumnNames?.length) {
    this.searchByString(pageOptionsDto.q, castArray(pageOptionsDto.qColumnNames), alias?.name);
  }

  if (pageOptionsDto?.order && pageOptionsDto?.orderColumnName) {
    const key = alias?.name ? `${alias.name}.${pageOptionsDto?.orderColumnName}` : pageOptionsDto?.orderColumnName;
    this.orderBy({ [key]: pageOptionsDto.order });
  }

  const [itemCount, entities] = await Promise.all([this.getCount(), this.getMany()]);
  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [entities, pageMetaDto];
};

SelectQueryBuilder.prototype.paginateRaw = async function (pageOptionsDto: PageOptionsDto, options?: Partial<{ takeAll: boolean }>) {
  const alias = this.expressionMap.mainAlias;

  if (!options?.takeAll) {
    this.offset(pageOptionsDto.skip).limit(pageOptionsDto.take);
  }

  if (pageOptionsDto?.q && pageOptionsDto.qColumnNames?.length) {
    this.searchByString(pageOptionsDto.q, castArray(pageOptionsDto.qColumnNames), alias?.name);
  }

  if (pageOptionsDto?.order && pageOptionsDto?.orderColumnName) {
    const key = alias?.name ? `${alias.name}.${pageOptionsDto?.orderColumnName}` : pageOptionsDto?.orderColumnName;
    this.orderBy({ [key]: pageOptionsDto.order });
  }

  const [itemCount, raws] = await Promise.all([this.getCount(), this.getRawMany()]);
  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [raws, pageMetaDto];
};

SelectQueryBuilder.prototype.getMany = async function () {
  const { entities, raw } = await this.getRawAndEntities();

  const items = entities.map((entitiy, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entitiy) ?? {};
    const item = raw[index];

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      entitiy[propertyKey] = item[name];
    }

    return entitiy;
  });

  return [...items];
};

SelectQueryBuilder.prototype.getOne = async function () {
  const { entities, raw } = await this.getRawAndEntities();
  if (!entities.length) return undefined;
  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entities[0]) ?? {};

  for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
    entities[0][propertyKey] = raw[0][name];
  }

  return entities[0];
};

SelectQueryBuilder.prototype.getOneOrFail = async function () {
  const entity = await this.getOne();
  if (!entity) {
    throw new HttpException('조회 실패', HttpStatus.NOT_FOUND);
  }
  return entity;
};
