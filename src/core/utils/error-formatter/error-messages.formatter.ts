import { Response } from "express";
import { ValidationError, ValidationErrorMessages } from "../../types/validation-error.type";
import { HttpStatus } from "../../types/http-statuses.type";
import { AppError } from "../../middlewares/errors/global-error.middleware";

export const errorMessagesFormatter = (errors: ValidationError[]): ValidationErrorMessages => ({
  errorsMessages: errors,
});

export const errorMessage = ({
  res,
  httpStatus,
  errors,
}: {
  res: Response;
  httpStatus: HttpStatus;
  errors: ValidationError[];
}) => {
  res.status(httpStatus).send(errorMessagesFormatter(errors));
};

export const ERROR_MESSAGES = {
  notFoundMessage(field: string, entity: string, name?: string): AppError {
    return {
      field,
      message: `${field} by ${entity} not found`,
      statusCode: HttpStatus.NotFound,
      name: name || "AppError",
    };
  },
};
