import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import * as providers from './services';

@Global()
@Module({
  imports: [HttpModule],
  providers: Object.values(providers),
  exports: [...Object.values(providers), HttpModule],
})
export class CommonModule {}
