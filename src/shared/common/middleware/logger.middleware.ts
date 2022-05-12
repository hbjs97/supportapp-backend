import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { Logger } from '../services';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private passUrl: string[] = ['/health', '/api', '/'];

  constructor(private readonly logger: Logger) {}

  public use(req: Request, res: Response, next: () => void): void {
    if (this.passUrl.includes(req.originalUrl)) {
      return next();
    }

    req.id = req.header('X-Request-Id') || uuidV4();
    res.setHeader('X-Request-Id', req.id);

    const user = req.user?.id || '';
    this.logger.log(`${req.method} ${req.originalUrl} - ${req.ip.replace('::ffff:', '')} ${user}`);

    return next();
  }
}
