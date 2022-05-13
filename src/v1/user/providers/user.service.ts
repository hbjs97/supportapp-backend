import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PageDto } from 'src/shared/common/dto';
import { GeneratorProvider } from 'src/shared/common/providers';
import { generateHash } from 'src/shared/common/utils';
import { UserEntity } from 'src/shared/entities/user.entity';
import { MallRepository } from 'src/shared/repositories/mall.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { Optional } from 'src/types';
import { FindConditions } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDuplicationDto } from '../dto/user-duplication.dto';
import { UserDto } from '../dto/user.dto';
import { UsersPageOptionsDto } from '../dto/users-page-options.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private mallRepository: MallRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...createUserDto,
      id: GeneratorProvider.uuid(),
      password: generateHash(createUserDto.password),
    });

    await this.userRepository.createQueryBuilder().insert().values(user).execute();
    return user;
  }

  async updateUser(id: UUID, updateUserDto: Partial<UserEntity>): Promise<UserDto> {
    if (updateUserDto.password) {
      Object.assign(updateUserDto, { password: generateHash(updateUserDto.password) });
    }

    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .where({ id })
      .set(updateUserDto)
      .execute()
      .catch((error) => {
        throw new HttpException('사용자 정보 수정 실패', HttpStatus.INTERNAL_SERVER_ERROR);
      });

    return await this.getUserProfile(id);
  }

  async findOne(findData: FindConditions<UserEntity>): Promise<Optional<UserEntity>> {
    return await this.userRepository.findOne(findData);
  }

  async getSubscribers(userId: UUID, pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    const malls = await this.mallRepository.getMallsByUserId(userId);
    const mallIds = malls.map((v) => v.id);

    const [items, pageMetaDto] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.bookmarks', 'bookmarks', 'bookmarks.mallId IN (:mallIds)', { mallIds })
      .paginate(pageOptionsDto);
    return items.toPageDto(pageMetaDto);
  }

  async isDuplicated(userDuplicationDto: UserDuplicationDto): Promise<boolean> {
    return !!(await this.userRepository.findOne({ where: { [userDuplicationDto.column]: userDuplicationDto.value } }));
  }

  async getUserProfile(id: UUID): Promise<UserDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.name', 'user.phone', 'user.role', 'user.createdAt', 'user.updatedAt', 'user.deletedAt'])
      .where('user.id = :id', { id })
      .getOneOrFail()
      .catch((error) => {
        throw new HttpException('사용자 조회 실패', HttpStatus.NOT_FOUND);
      });
    return user.toDto();
  }

  async getReceivers(id: UUID[]): Promise<UserEntity[]> {
    return await this.userRepository.createQueryBuilder().where('id IN (:id)', { id }).getMany();
  }
}
