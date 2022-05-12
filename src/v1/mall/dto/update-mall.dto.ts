import { PartialType } from '@nestjs/swagger';
import { CreateMallDto } from './create-mall.dto';

export class UpdateMallDto extends PartialType(CreateMallDto) {}
