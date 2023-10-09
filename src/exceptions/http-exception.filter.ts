import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { Request, Response } from "express";
import { CustomLogger } from "src/logger/logger.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: CustomLogger) {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const httpContext = host.switchToHttp();
        
        const response: Response = httpContext.getResponse();
        const request: Request = httpContext.getRequest();

        const status = 
            exception instanceof HttpException ? 
                exception.getStatus() : 
                HttpStatus.INTERNAL_SERVER_ERROR;
        
        if (exception instanceof InternalServerErrorException) {
            const payload = {
                timestamp: new Date().toISOString(),
                path: request.originalUrl,
                message: exception.message,
                stack: exception.stack
            };
            this.logger.error(exception.message, payload);
        }

        response.status(status).json({ error: exception.message });

    }

} 