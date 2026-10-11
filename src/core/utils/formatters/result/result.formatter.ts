import {
  ErrorResult,
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
  SuccessResult,
  ValidationError,
  ValidationErrorMessages,
} from "../../../types/validation-error.type";

export const okResult = <T>({
  data,
  status,
}: {
  status: ResultSuccessStatus;
  data: T;
}): SuccessResult<T> => ({
  status,
  data,
});

export const failResult = ({
  errorMessage,
  extensions,
  status,
}: {
  status: ResultErrorStatus;
  errorMessage?: string;
  extensions: ValidationError[];
}): ErrorResult => ({
  status,
  data: null,
  errorMessage: errorMessage ?? status,
  extensions,
});

export const isSuccess = <T extends Result<unknown>>(
  r: T,
): r is Extract<T, SuccessResult<Record<string, unknown>>> =>
  Object.values(ResultSuccessStatus).includes(r.status as ResultSuccessStatus);

export const isError = <T extends Result<unknown>>(r: T): r is Extract<T, ErrorResult> =>
  Object.values(ResultErrorStatus).includes(r.status as ResultErrorStatus);

export const errorMessagesFormatter = (errors: ValidationError[]): ValidationErrorMessages => ({
  errorsMessages: errors.map((error) => ({ field: error.field, message: error.message })),
});
