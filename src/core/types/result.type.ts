import { ValidationError } from "./validation-error.type";

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
  status: ResultErrorStatus;
  data: null;
  errorMessage: string;
  extensions: ValidationError[];
};
export type SuccessResult<T> = {
  status: ResultSuccessStatus;
  data: T;
};

export type Result<T> = (T extends unknown ? SuccessResult<T> : never) | ErrorResult;
