import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authService } from "../service/auth.service";
import { ResultSuccessStatus } from "../../../core/types/result.type";

export const registrationEmailResendingAuthHandler = async (
  _req: Request,
  res: Response<
    ValidationErrorMessages | undefined,
    {
      body: {
        email: string;
      };
    }
  >,
) => {
  const result = await authService.registrationEmailResendingAuth(res.locals.body.email);
  sendResult({ res, result, overwriteSuccessStatus: ResultSuccessStatus.NoContent });
};
