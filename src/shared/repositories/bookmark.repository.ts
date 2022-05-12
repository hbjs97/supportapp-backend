import { EntityRepository, Repository } from 'typeorm';
import { BookmarkEntity } from '../entities/bookmark.entity';

@EntityRepository(BookmarkEntity)
export class BookmarkRepository extends Repository<BookmarkEntity> {}
