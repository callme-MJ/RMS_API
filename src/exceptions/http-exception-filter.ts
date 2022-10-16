import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, BadRequestException, Logger } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { HttpAdapterHost } from "@nestjs/core";
import { NotFoundException } from "./not-found-exception";
import { ValidationException } from "./validation-exception";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception, host: ArgumentsHost) {

        const ctx: HttpArgumentsHost = host.switchToHttp();
        
        let status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message || exception;

        if (exception instanceof ValidationException) {
            status = HttpStatus.BAD_REQUEST;
        } else if (exception instanceof NotFoundException) {
            status = HttpStatus.NOT_FOUND;
        } else if (exception instanceof BadRequestException) {
            // Handle errors caught by validation pipe which is enabled globally
            message = exception.getResponse();

            // take only error messages
            if(message.message && message.message.length ) {
                message = message.message;
            }
        }
        
        const { httpAdapter } = this.httpAdapterHost;

        const body = {
            data: message,
            success: false
        }

        httpAdapter.reply(ctx.getResponse(), body, status);
    }
}