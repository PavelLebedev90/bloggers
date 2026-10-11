import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { AuthInputModel } from "../types/auth-input.type";
import { authService } from "../service/auth.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authTokenToOutputMapper } from "../mappers/auth-to-output.mapper";

export const loginHandler = async (
  _req: Request,
  res: Response<
    { accessToken: string } | ValidationErrorMessages,
    {
      body: AuthInputModel;
    }
  >,
) => {
  const result = await authService.login(res.locals.body);
  sendResult(res, result, authTokenToOutputMapper);
};
