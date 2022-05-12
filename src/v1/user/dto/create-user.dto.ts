import { EmailField, EnumField, PasswordField, PhoneField, StringField } from 'src/shared/common';
import { Role } from 'src/shared/common/constants';

export class CreateUserDto {
  @EmailField()
  readonly email!: string;

  @StringField({ maxLength: 50, description: '이름' })
  readonly name!: string;

  @PasswordField({ minLength: 4, maxLength: 50, description: '비밀번호' })
  readonly password!: string;

  @PhoneField({ description: '휴대전화 번호 11자리' })
  readonly phone!: string;

  @EnumField(() => Role)
  readonly role!: Role;
}
