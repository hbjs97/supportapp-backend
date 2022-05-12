import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileService, IFile, ValidatorProvider } from 'src/shared/common';
import { FileNotImageException } from 'src/shared/common/exceptions';
import { MallEntity } from 'src/shared/entities/mall.entity';
import { MallRepository } from 'src/shared/repositories';
import { GetMallsDto } from '../dto';
import { CreateMallDto } from '../dto/create-mall.dto';
import { UpdateMallDto } from '../dto/update-mall.dto';

@Injectable()
export class MallService {
  constructor(private mallRepository: MallRepository, private fileService: FileService) {}

  async createMall(userId: UUID, createMallDto: CreateMallDto, thumbnail?: IFile): Promise<MallEntity> {
    const job = this.mallRepository.create({
      ...createMallDto,
      geo: createMallDto.geo,
      createdBy: userId,
    });

    if (thumbnail && !ValidatorProvider.isImage(thumbnail.mimetype)) {
      throw new FileNotImageException();
    }

    if (thumbnail) {
      const mallFile = await this.fileService.uploadImage(thumbnail);
      Object.assign(job, { thumbnail: mallFile.location });
    }

    await this.mallRepository
      .createQueryBuilder()
      .insert()
      .values(job)
      .execute()
      .catch((error) => {
        throw new HttpException('매장 등록 실패', HttpStatus.INTERNAL_SERVER_ERROR);
      });

    return job;
  }

  async updateMall(id: string, updateMallDto: UpdateMallDto, thumbnail?: IFile): Promise<void> {
    if (thumbnail && !ValidatorProvider.isImage(thumbnail.mimetype)) {
      throw new FileNotImageException();
    }

    if (thumbnail) {
      const mallFile = await this.fileService.uploadImage(thumbnail);
      Object.assign(updateMallDto, { thumbnail: mallFile.location });
    }

    await this.mallRepository
      .createQueryBuilder()
      .update(MallEntity)
      .where({ id })
      .set(updateMallDto)
      .execute()
      .catch((error) => {
        throw new HttpException('매장 수정 실패', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async getMalls(userId: UUID, getMallsDto: GetMallsDto): Promise<MallEntity[]> {
    const getMallsQueryBuilder = this.mallRepository
      .createQueryBuilder('mall')
      .addSelect(['mall.openAt < DATE_FORMAT(NOW(), "%H:%i") AND DATE_FORMAT(NOW(), "%H:%i") < mall.closeAt as isOpen'])
      .leftJoinAndSelect('mall.bookmarks', 'bookmarks', 'bookmarks.createdBy = :userId', { userId })
      .innerJoinAndSelect('mall.user', 'user');
    if (getMallsDto.q) {
      getMallsQueryBuilder.andWhere('mall.name LIKE :q', { q: `%${getMallsDto.q}%` });
    }

    return await getMallsQueryBuilder.getMany();
  }

  async getMyMalls(userId: UUID): Promise<MallEntity[]> {
    return await this.mallRepository
      .createQueryBuilder('mall')
      .addSelect('mall.openAt < DATE_FORMAT(NOW(), "%H:%i") AND DATE_FORMAT(NOW(), "%H:%i") < mall.closeAt as isOpen')
      .innerJoinAndSelect('mall.user', 'user', 'user.id = :userId', { userId })
      .getMany();
  }

  async getBookmarkedMalls(userId: UUID): Promise<MallEntity[]> {
    return await this.mallRepository
      .createQueryBuilder('mall')
      .addSelect('IF(mall.openAt < DATE_FORMAT(NOW(), "%H:%i") AND mall.closeAt < DATE_FORMAT(NOW(), "%H:%i"), 1, 0) as isOpen')
      .innerJoinAndSelect('mall.bookmarks', 'bookmarks', 'bookmarks.createdBy = :userId', { userId })
      .getMany();
  }
}
