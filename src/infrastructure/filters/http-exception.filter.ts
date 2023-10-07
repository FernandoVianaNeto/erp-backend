import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../logger/application/services/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.getResponse();

    this.loggerService.error({
      request: {
        method: request?.method,
        url: request?.url,
        headers: request?.headers,
        query: request?.query,
        params: request?.params,
        body: request?.body,
      },
    });

    response.status(status).json({
      status: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
