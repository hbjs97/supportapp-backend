import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MallRepository } from 'src/shared/repositories';
import { UserRepository } from 'src/shared/repositories/user.repository';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, MallRepository])],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class UserModule {}
