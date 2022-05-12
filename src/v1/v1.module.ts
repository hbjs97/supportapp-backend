import { Module } from '@nestjs/common';
import { AuthModule } from 'src/v1/auth/auth.module';
import { BaseModule } from './base';
import { MallModule } from './mall/mall.module';

@Module({
  imports: [BaseModule, AuthModule, MallModule],
})
export class V1Module {}
