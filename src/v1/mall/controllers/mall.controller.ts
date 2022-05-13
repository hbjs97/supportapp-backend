import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile } from '@nestjs/common';
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFile, Auth, IFile, ReqUser, Role } from 'src/shared/common';
import { UserLoginPayload } from 'src/v1/auth';
import { CreateMallDto, GetMallsDto } from '../dto';
import { MallDto } from '../dto/mall.dto';
import { UpdateMallDto } from '../dto/update-mall.dto';
import { MallService } from '../providers/mall.service';

@ApiTags('mall')
@Controller({
  path: 'malls',
  version: ['1'],
})
export class MallController {
  constructor(private mallService: MallService) {}

  @ApiOperation({ summary: '매장 목록 조회' })
  @Auth([Role.USER, Role.MERCHANT])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MallDto, isArray: true, description: '매장 목록 조회 성공' })
  @Get()
  public async getMalls(@ReqUser() user: UserLoginPayload, @Query() mallsPageOptionsDto: GetMallsDto): Promise<MallDto[]> {
    const malls = await this.mallService.getMalls(user.id, mallsPageOptionsDto);
    return malls.toDtos();
  }

  @ApiOperation({ summary: '내 매장 목록 조회' })
  @Auth([Role.MERCHANT])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MallDto, isArray: true, description: '매장 목록 조회 성공' })
  @Get('my')
  public async getMyMalls(@ReqUser() user: UserLoginPayload): Promise<MallDto[]> {
    return (await this.mallService.getMyMalls(user.id)).toDtos();
  }

  @ApiOperation({ summary: '즐겨찾기 매장 목록 조회' })
  @Auth([Role.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MallDto, isArray: true, description: '즐겨찾기 매장 목록 조회 성공' })
  @Get('bookmarks')
  public async getBookmarkedMalls(@ReqUser() user: UserLoginPayload): Promise<MallDto[]> {
    const malls = await this.mallService.getBookmarkedMalls(user.id);
    return malls.toDtos();
  }

  @ApiOperation({ summary: '매장 조회' })
  @Auth([Role.USER, Role.MERCHANT])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MallDto, description: '매장 조회 성공' })
  @Get(':id')
  public async getMall(@Param('id') id: string): Promise<MallDto> {
    return (await this.mallService.getMallById(id)).toDto();
  }

  @ApiOperation({ summary: '매장 등록' })
  @Auth([Role.MERCHANT])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: MallDto, description: '매장 등록 성공' })
  @ApiFile({ name: 'thumbnail' })
  @Post()
  public async createMall(@UploadedFile() thumbnail: IFile, @ReqUser() user: UserLoginPayload, @Body() createMallDto: CreateMallDto): Promise<MallDto> {
    const mall = await this.mallService.createMall(user.id, createMallDto, thumbnail);
    return mall.toDto();
  }

  @ApiOperation({ summary: '매장 수정' })
  @Auth([Role.MERCHANT])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: '매장 수정 성공' })
  @ApiFile({ name: 'thumbnail' })
  @Patch(':mallId')
  public async updateMall(@UploadedFile() thumbnail: IFile, @Param('mallId') mallId: string, @Body() updateMallDto: UpdateMallDto): Promise<void> {
    await this.mallService.updateMall(mallId, updateMallDto, thumbnail);
  }
}
