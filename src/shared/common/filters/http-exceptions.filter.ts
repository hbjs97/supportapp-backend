import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter extends BaseExceptionFilter {
  private readonly logger: Logger = new Logger();

  public override catch(exception: HttpException, host: ArgumentsHost): void {
    super.catch(exception, host);

    const req = host.switchToHttp().getRequest<Request>();
    const args: unknown = req.body;

    const status = this.getHttpStatus(exception);
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (exception instanceof Error) {
        this.logger.error(`${exception.message}: `, args, exception.stack);
      } else {
        this.logger.error('UnhandledException', exception);
      }
    }
  }

  private getHttpStatus(exception: unknown): number {
    return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
