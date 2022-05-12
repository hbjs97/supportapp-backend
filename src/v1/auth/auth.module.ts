import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { JwtAccessStrategy, JwtRefreshStrategy, LocalStrategy } from './strategies';
import { PublicStrategy } from './strategies/public.strategy';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthSerializer, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy, PublicStrategy],
  exports: [AuthService],
})
export class AuthModule {}
