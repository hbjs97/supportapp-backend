import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth, Public, ReqUser } from 'src/shared/common';
import { Role } from 'src/shared/common/constants';
import { PageDto } from 'src/shared/common/dto';
import { UserLoginPayload } from 'src/v1/auth';
import { UserDuplicationDto } from '../dto/user-duplication.dto';
import { UserDto } from '../dto/user.dto';
import { UsersPageOptionsDto } from '../dto/users-page-options.dto';
import { UserService } from '../providers';

@ApiTags('user')
@Controller({
  path: 'users',
  version: ['1'],
})
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: '내 매장을 즐겨찾기 한 사용자 목록 조회' })
  @Auth([Role.MERCHANT])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: UserDto, description: '내 매장을 즐겨찾기 한 사용자 목록 조회 성공' })
  @Get('subscribers')
  public async getSubscribers(@ReqUser() user: UserLoginPayload, @Query() usersPageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    return await this.userService.getSubscribers(user.id, usersPageOptionsDto);
  }

  @Public()
  @ApiOperation({ summary: '중복 검사' })
  @Get('duplication')
  public async checkDuplication(@Query() userDuplicationDto: UserDuplicationDto): Promise<Record<string, boolean>> {
    const isDuplicated = await this.userService.isDuplicated(userDuplicationDto);
    return { isDuplicated };
  }
}
