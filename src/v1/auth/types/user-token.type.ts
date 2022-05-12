import { UserEntity } from 'src/shared/entities/user.entity';

export type UserLoginPayload = Pick<UserEntity, 'id' | 'name' | 'email' | 'role'>;

export type JwtPayload = UserLoginPayload & { exp?: number; iat?: number };

export type JwtRefreshPayload = JwtPayload & { refreshToken: string };
