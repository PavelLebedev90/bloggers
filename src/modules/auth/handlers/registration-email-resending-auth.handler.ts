import { Response, Request } from "express";
import {
  ResultSuccessStatus,
  ValidationErrorMessages,
} from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { authService } from "../service/auth.service";

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
  if (isError(result)) return sendResult(res, result);
  sendResult<ResultSuccessStatus.NoContent>(res, {
    ...result,
    status: ResultSuccessStatus.NoContent,
  });
};
