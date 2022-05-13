import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth, Public, ReqUser } from 'src/shared/common';
import { Role } from 'src/shared/common/constants';
import { PageDto } from 'src/shared/common/dto';
import { UserLoginPayload } from 'src/v1/auth';
import { PublishAlarmDto } from '../dto/publish-alarm.dto';
import { UserDuplicationDto } from '../dto/user-duplication.dto';
import { UserDto } from '../dto/user.dto';
import { UsersPageOptionsDto } from '../dto/users-page-options.dto';
import { MailService, UserService } from '../providers';

@ApiTags('user')
@Controller({
  path: 'users',
  version: ['1'],
})
export class UserController {
  constructor(private userService: UserService, private mailService: MailService) {}

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

  @ApiOperation({ summary: '알람 발송' })
  @Auth([Role.MERCHANT])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '알람 발송 성공' })
  @Post('publish-alarms')
  public async publishAlarm(@ReqUser() user: UserLoginPayload, @Body() publishAlarmDto: PublishAlarmDto): Promise<void> {
    const receivers = await this.userService.getReceivers(publishAlarmDto.receiveUserIds);
    if (!receivers.length) throw new HttpException('수신자 정보를 찾을 수 없습니다.', HttpStatus.FORBIDDEN);
    await this.mailService.sendMail(
      user.email,
      receivers.map((v) => v.email),
      publishAlarmDto.title,
      publishAlarmDto.content,
    );
  }
}
