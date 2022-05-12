import { EntityRepository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { BaseRepo } from './base.repository';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepo<UserEntity> {}
