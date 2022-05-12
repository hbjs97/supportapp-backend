import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookmarkRepository } from 'src/shared/repositories';

@Injectable()
export class BookmarkService {
  constructor(private bookmarkRepository: BookmarkRepository) {}

  public async bookmarking(userId: UUID, mallId: string): Promise<void> {
    await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .insert()
      .values({
        createdBy: userId,
        mallId,
        deletedAt: null,
      })
      .orUpdate(['deleted_at'], ['createdBy', 'mallId'])
      .execute()
      .catch((error) => {
        throw new HttpException('북마크 실패', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async cancelBookmark(userId: UUID, mallId: string): Promise<void> {
    await this.bookmarkRepository.softDelete({ createdBy: userId, mallId }).catch((error) => {
      throw new HttpException('북마크 해제 실패', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
