import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, ReqUser, Role } from 'src/shared/common';
import { CreateUserDto, LoginUserDto, UserDto } from '../user/dto';
import { UserService } from '../user/providers';
import { AuthService } from './auth.service';
import { LoginPayloadDto, TokenizedUserPayloadDto } from './dto';
import { LocalLoginGuard } from './guards';
import { JwtRefreshPayload, UserLoginPayload } from './types';

@ApiTags('auth')
@Controller({
  version: ['1'],
})
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: UserDto, description: '회원가입 성공' })
  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.userService.createUser(createUserDto);
    return createdUser.toDto();
  }

  @UseGuards(LocalLoginGuard)
  @ApiOperation({ summary: '로그인' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginPayloadDto, description: '로그인 성공' })
  @Post('login')
  public async userLogin(@ReqUser() user: UserLoginPayload, @Body() loginUserDto: LoginUserDto): Promise<LoginPayloadDto> {
    const token = await this.authService.signJwt(user);
    return new LoginPayloadDto(new TokenizedUserPayloadDto(user), token);
  }

  @ApiOperation({ summary: 'refresh token 으로 요청' })
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginPayloadDto, description: 'jwt refresh 성공' })
  @Post('refresh')
  public async refreshTokens(@ReqUser() refreshPayload: JwtRefreshPayload): Promise<LoginPayloadDto> {
    const token = await this.authService.refreshTokens(refreshPayload);
    const { refreshToken, ...jwtPayload } = refreshPayload;
    return new LoginPayloadDto(new TokenizedUserPayloadDto(jwtPayload), token);
  }

  @ApiOperation({ summary: '탈퇴' })
  @Auth([Role.USER, Role.MERCHANT])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ type: UserDto, description: '탈퇴 성공' })
  @Delete('unregister')
  public async unregister(@ReqUser() user: UserLoginPayload): Promise<UserDto> {
    return await this.userService.updateUser(user.id, { deletedAt: new Date() });
  }
}
