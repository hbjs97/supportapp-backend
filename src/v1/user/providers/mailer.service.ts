import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from 'src/shared/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {}

  async sendMail(from: string, to: string[], subject: string, content: string) {
    await this.mailerService
      .sendMail({
        to,
        from: this.configService.get('smtp.user'),
        subject,
        html: content,
      })
      .catch((error) => {
        throw new HttpException('메일 발송 실패.', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}
