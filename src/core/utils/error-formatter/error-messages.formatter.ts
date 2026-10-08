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
  unauthorized(field: string, entity: string, name?: string): AppError {
    return {
      field,
      message: `${field} by ${entity} is not valid`,
      statusCode: HttpStatus.Unauthorized,
      name: name || "AppError",
    };
  },
  conflict(field: string, entity: string, name?: string): AppError {
    return {
      field,
      message: `${field} by ${entity} is already in used`,
      statusCode: HttpStatus.Conflict,
      name: name || "AppError",
    };
  },
  forbidden(field: string, entity: string, name?: string): AppError {
    return {
      field,
      message: `You do not have permission to edit or delete ${field} by ${entity}`,
      statusCode: HttpStatus.Forbidden,
      name: name || "AppError",
    };
  },
};
