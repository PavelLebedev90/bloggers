import { ValidationError } from "./validation-error.type";

export enum TypeResult {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}
export enum ResultSuccessStatus {
  Ok = "Ok",
  Created = "Created",
  NoContent = "NoContent",
}

export enum ResultErrorStatus {
  BadRequest = "BadRequest",
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
  NotFound = "NotFound",
  Conflict = "Conflict",
  InternalServerError = "InternalServerError",
}

export type ErrorResult = {
  type: TypeResult.ERROR;
  status: ResultErrorStatus;
  data: null;
  errorMessage: string;
  extensions: ValidationError[];
};
export type SuccessResult<T> = {
  type: TypeResult.SUCCESS;
  status: ResultSuccessStatus;
  data: T;
};

export type Result<T> = SuccessResult<T> | ErrorResult;
