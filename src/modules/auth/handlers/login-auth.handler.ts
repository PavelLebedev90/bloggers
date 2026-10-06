import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { AuthInputModel } from "../types/auth-input.type";
import { authService } from "../service/auth.service";

export const loginHandler = async (
  _req: Request,
  res: Response<
    ValidationErrorMessages,
    {
      body: AuthInputModel;
    }
  >,
) => {
  await authService.login(res.locals.body);
  res.sendStatus(HttpStatus.NoContent);
};
