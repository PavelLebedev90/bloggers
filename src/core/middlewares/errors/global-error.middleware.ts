import { NextFunction, Request, Response } from "express";
import { errorMessage } from "../../utils/error-formatter/error-messages.formatter";
import { HttpStatus } from "../../types/http-statuses.type";

export class AppError extends Error {
  field: string;
  statusCode: HttpStatus;

  constructor(options: { message: string; field: string; statusCode: HttpStatus; name: string }) {
    super(options.message);
    this.name = options.name;
    this.statusCode = options.statusCode;
    this.field = options.field;
  }
}

export const globalErrorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  __next: NextFunction,
) => {
  if (err instanceof AppError) {
    errorMessage({
      res,
      httpStatus: err.statusCode,
      errors: [
        {
          field: err.field,
          message: err.message,
        },
      ],
    });
    return;
  }

  errorMessage({
    res,
    httpStatus: HttpStatus.InternalServerError,
    errors: [
      {
        field: "",
        message: "Internal Server Error",
      },
    ],
  });
};
