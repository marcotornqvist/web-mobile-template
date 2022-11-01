import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { errorsType } from 'types';
import { capitalizeFirstLetter } from 'utils/capitalizeFirstLetter';

export function ValidationPipeErrorsFormatted() {
  return new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const formErrors: errorsType = {};

      validationErrors.forEach((item: any) => {
        const arrayOfErrors = Object.keys(item.constraints).map((key) =>
          capitalizeFirstLetter(item.constraints[key]),
        );

        if (arrayOfErrors.length > 0) {
          formErrors[item.property] = arrayOfErrors[0];
        }
      });

      return new BadRequestException({
        statusCode: 400,
        formErrors,
        error: 'Bad Request',
      });
    },
    whitelist: true,
  });
}
