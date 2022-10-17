import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { errorsType } from 'types';

export function ValidationPipeErrorsFormatted() {
  return new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const fieldErrors: errorsType = {};

      validationErrors.forEach((item: any) => {
        const arrayOfErrors = Object.keys(item.constraints).map(
          (key) => item.constraints[key],
        );

        fieldErrors[item.property] = arrayOfErrors;
      });

      return new BadRequestException({
        statusCode: 400,
        fieldErrors,
        error: 'Bad Request',
      });
    },
    whitelist: true,
  });
}
