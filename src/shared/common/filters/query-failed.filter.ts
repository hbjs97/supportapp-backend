import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';
import { constraintErrors } from './constraint-errors';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
  constructor(public reflector: Reflector) {}

  catch(exception: QueryFailedError & { code?: string; constraint?: string }, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const constraint = exception.message.split('key ')[1]?.replace(/'/g, '');
    const status = constraint?.startsWith('UQ') ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      status,
      error: STATUS_CODES[status],
      message: constraint ? constraintErrors[constraint] : undefined,
    });
  }
}
