import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkRepository, MallRepository } from 'src/shared/repositories';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [TypeOrmModule.forFeature([MallRepository, BookmarkRepository])],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class MallModule {}
