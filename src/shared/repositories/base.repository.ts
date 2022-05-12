import { ObjectLiteral, Repository } from 'typeorm';

export class BaseRepo<T extends ObjectLiteral> extends Repository<T> {}
