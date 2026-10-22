import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { UserInputModel } from "../../users/types/users-input.type";
import { authService } from "../service/auth.service";
import { ResultSuccessStatus } from "../../../core/types/result.type";

export const registrationAuthHandler = async (
  _req: Request,
  res: Response<
    ValidationErrorMessages | undefined,
    {
      body: UserInputModel;
    }
  >,
) => {
  const result = await authService.createUser(res.locals.body);
  sendResult({ res, result, overwriteSuccessStatus: ResultSuccessStatus.NoContent });
};
