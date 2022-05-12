import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('사용자 정보가 일치하지 않습니다', error);
  }
}
