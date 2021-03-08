import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MongoError } from 'mongodb';
import {
  DocumentNotFoundError,
  IllegalOperationError,
  UserInputError,
} from './errors';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
          if (
          err instanceof UserInputError ||
          err instanceof DocumentNotFoundError
        ) {
          return throwError(new BadRequestException(err));
        }

        if (err instanceof IllegalOperationError) {
          return throwError(new ForbiddenException(err));
        }

        if (err instanceof BadRequestException) {
          return throwError(err);
        }

        if (err instanceof MongoError) {
          switch (err.code) {
            case 11000:
              return throwError(
                new BadRequestException({
                  // @ts-ignore
                  message: `${Object.keys(err.keyValue)[0]} already exist`,
                  code: 'DUPLICATED_KEY_ERROR',
                  // @ts-ignore
                  variables: err.keyValue,
                }),
              );
          }
        }

        console.error(err)

        return throwError(new InternalServerErrorException());
      }),
    );
  }
}
