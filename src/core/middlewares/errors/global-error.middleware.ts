import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/http-statuses.type";
import { sendError } from "../../utils/formatters/result/send-result.formatter";

export const globalErrorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  __next: NextFunction,
) => {
  return sendError({
    res,
    httpStatus: HttpStatus.InternalServerError,
    errors: [
      {
        field: err instanceof Error ? err.message : "",
        message: "Internal Server Error",
      },
    ],
  });
};
