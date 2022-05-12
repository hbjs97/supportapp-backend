import { EntityRepository, Repository } from 'typeorm';
import { MallEntity } from '../entities/mall.entity';

@EntityRepository(MallEntity)
export class MallRepository extends Repository<MallEntity> {
  async getMallsByUserId(userId: UUID): Promise<MallEntity[]> {
    return await this.find({ where: { createdBy: userId } });
  }
}
