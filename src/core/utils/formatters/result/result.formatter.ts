import {
  ErrorResult,
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
  SuccessResult,
  TypeResult,
} from "../../../types/result.type";
import { ValidationError, ValidationErrorMessages } from "../../../types/validation-error.type";

export const okResult = <T>({
  data,
  status,
}: {
  status: ResultSuccessStatus;
  data: T;
}): SuccessResult<T> => ({
  type: TypeResult.SUCCESS,
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
  type: TypeResult.ERROR,
  status,
  data: null,
  errorMessage: errorMessage ?? status,
  extensions,
});

export const isSuccess = <T extends Result<unknown>>(
  r: T,
): r is Extract<T, SuccessResult<Record<string, unknown>>> => r.type === TypeResult.SUCCESS;

export const isError = <T extends Result<unknown>>(r: T): r is Extract<T, ErrorResult> =>
  r.type === TypeResult.ERROR;

export const errorMessagesFormatter = (errors: ValidationError[]): ValidationErrorMessages => ({
  errorsMessages: errors.map((error) => ({ field: error.field, message: error.message })),
});
