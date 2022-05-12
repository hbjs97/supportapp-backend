import { v4 as uuidV4 } from 'uuid';

export class GeneratorProvider {
  static uuid(): string {
    return uuidV4();
  }

  static fileName(ext: string): string {
    return `${GeneratorProvider.uuid()}.${ext}`;
  }

  static generateVerificationCode(): string {
    return (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
  }

  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length));
  }
}
