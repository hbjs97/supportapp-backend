import { Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, ReqUser, Role } from 'src/shared/common';
import { UserLoginPayload } from 'src/v1/auth';
import { BookmarkService } from '../providers';

@ApiTags('bookmark')
@Controller({
  path: 'bookmarks',
  version: ['1'],
})
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @ApiOperation({ summary: '즐겨찾기 등록' })
  @Auth([Role.USER, Role.MERCHANT])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: '즐겨찾기 성공' })
  @Post(':mallId')
  public async bookmarking(@ReqUser() user: UserLoginPayload, @Param('mallId') mallId: string): Promise<void> {
    await this.bookmarkService.bookmarking(user.id, mallId);
  }

  @ApiOperation({ summary: '즐겨찾기 해제' })
  @Auth([Role.USER, Role.MERCHANT])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: '즐겨찾기 해제 성공' })
  @Delete(':mallId')
  public async cancelBookmark(@ReqUser() user: UserLoginPayload, @Param('mallId') mallId: string): Promise<void> {
    await this.bookmarkService.cancelBookmark(user.id, mallId);
  }
}
