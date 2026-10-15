import { Response } from "express";
import { HttpStatus } from "../../../types/http-statuses.type";
import { ValidationError } from "../../../types/validation-error.type";
import { errorMessagesFormatter, isError } from "./result.formatter";
import { ERROR_MESSAGES } from "../../../consts/error.messages.const";
import { Result, ResultSuccessStatus, SuccessResult } from "../../../types/result.type";

// Тип data успешной части результата (с дистрибутивным Result раскладывается по объединению)
type SuccessData<R> = R extends SuccessResult<infer D> ? D : never;

type Mapper<R, ResBody> = (data: SuccessData<R>) => NoInfer<ResBody>;

type IsExact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

type IsNever<T> = [T] extends [never] ? true : false;

type MapperArgs<R, ResBody> =
  IsNever<SuccessData<R>> extends true
    ? [] // данных для отправки нет: ErrorResult или только NoContent
    : IsExact<SuccessData<R>, ResBody> extends true
      ? [mapper?: Mapper<R, ResBody>]
      : [mapper: Mapper<R, ResBody>];

// Для NoContent аргументов после result нет вообще, иначе работает проверка mapper'а
type SendResultArgs<S, R, ResBody> = [S] extends [ResultSuccessStatus.NoContent]
  ? []
  : MapperArgs<R, ResBody>;

// Публичная сигнатура: строгая
export function sendResult<
  S extends ResultSuccessStatus.NoContent | undefined = undefined,
  // eslint-disable-next-line
  ResBody = any,
  R extends Result<unknown> = Result<unknown>,
>(res: Response<ResBody>, result: R, ...args: SendResultArgs<S, R, ResBody>): void;

export function sendResult(
  res: Response,
  result: Result<unknown>,
  // eslint-disable-next-line
  mapper?: (data: any) => unknown,
) {
  const httpStatus = HttpStatus[result.status];

  if (isError(result)) {
    return sendError({ res, httpStatus, errors: result.extensions });
  }
  if (result.status === ResultSuccessStatus.NoContent) return res.sendStatus(httpStatus);
  return res.status(httpStatus).send(mapper ? mapper(result.data) : result.data);
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
