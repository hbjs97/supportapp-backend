import { getValue, setValue } from 'express-ctx';
import { UserEntity } from 'src/shared/entities/user.entity';
import type { Optional } from 'src/types';

export class ContextProvider {
  private static readonly nameSpace: 'request' = 'request';

  private static readonly authUserKey: 'user_key' = 'user_key';

  static setAuthUser(user: UserEntity): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static getAuthUser(): Optional<UserEntity> {
    return ContextProvider.get<UserEntity>(ContextProvider.authUserKey);
  }

  private static get<T>(key: string): Optional<T> {
    return getValue<T>(ContextProvider.getKeyWithNamespace(key));
  }

  private static set(key: string, value: any): void {
    setValue(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }
}
