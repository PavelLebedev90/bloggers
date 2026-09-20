import { Response } from "express";
import { ValidationError, ValidationErrorMessages } from "../../types/validation-error.type";
import { HttpStatus } from "../../types/http-statuses.type";

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
