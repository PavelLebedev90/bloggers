import { Response } from "express";
import { HttpStatus } from "../../../types/http-statuses.type";
import { ValidationError } from "../../../types/validation-error.type";
import { errorMessagesFormatter, isError } from "./result.formatter";
import { ERROR_MESSAGES } from "../../../consts/message/error.message.const";
import { Result, ResultSuccessStatus, SuccessResult } from "../../../types/result.type";

export function sendResult<T>({
  res,
  result,
  overwriteSuccessStatus,
  mapper,
}: {
  res: Response;
  result: Result<T>;
  overwriteSuccessStatus?: ResultSuccessStatus | null;
  mapper?: (data: SuccessResult<T>["data"]) => unknown;
}) {
  const httpStatus = HttpStatus[result.status];

  if (isError(result)) {
    return sendError({ res, httpStatus, errors: result.extensions });
  }
  const successStatus = HttpStatus[overwriteSuccessStatus ?? result.status];
  if (successStatus === HttpStatus.NoContent) return res.sendStatus(successStatus);
  return res.status(successStatus).send(mapper ? mapper(result.data) : result.data);
}

export const sendError = ({
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

export const failUnauthorized = (res: Response) => {
  return sendError({
    res,
    httpStatus: HttpStatus.Unauthorized,
    errors: [ERROR_MESSAGES.Unauthorized("credentials")],
  });
};
