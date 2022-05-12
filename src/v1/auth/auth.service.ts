import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/shared/common';
import { UserNotFoundException } from 'src/shared/common/exceptions';
import { validateHash } from 'src/shared/common/utils';
import { UserEntity } from 'src/shared/entities/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserService } from '../user/providers';
import { JwtPayload, JwtRefreshPayload, Token, UserLoginPayload } from './types';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private configService: ConfigService, private userService: UserService) {}

  public async validateUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findOne({ email: loginUserDto.email });
    if (!user) throw new UserNotFoundException();

    const isPasswordValid = await validateHash(loginUserDto.password, user.password);
    if (!isPasswordValid) throw new UserNotFoundException();

    return user;
  }

  public async signJwt(userLoginPayload: UserLoginPayload): Promise<Token> {
    const jwtPayload: JwtPayload = {
      id: userLoginPayload.id,
      name: userLoginPayload.name,
      email: userLoginPayload.email,
      role: userLoginPayload.role,
    };
    return await this.getTokens(jwtPayload);
  }

  async getTokens(jwtPayload: JwtPayload): Promise<Token> {
    const { exp, iat, ...plainPayload } = jwtPayload;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService
        .signAsync(plainPayload, {
          secret: this.configService.get('jwtAccessSecret'),
          expiresIn: +this.configService.get('jwtAccessTokenExpireTime'),
        })
        .catch((error) => {
          throw new HttpException('jwt access token sign failed.', HttpStatus.UNAUTHORIZED);
        }),
      this.jwtService
        .signAsync(plainPayload, {
          secret: this.configService.get('jwtRefreshSecret'),
          expiresIn: +this.configService.get('jwtRefreshTokenExpireTime'),
        })
        .catch((error) => {
          throw new HttpException('jwt refresh token sign failed.', HttpStatus.UNAUTHORIZED);
        }),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshPayload: JwtRefreshPayload): Promise<Token> {
    const { refreshToken, ...jwtPayload } = refreshPayload;
    return await this.getTokens(jwtPayload);
  }
}
