import { NextFunction, Request, Response } from "express";
import { errorMessage } from "../../utils/error-formatter/error-messages.formatter";
import { HttpStatus } from "../../types/http-statuses.type";

export const globalErrorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    next(err);
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
