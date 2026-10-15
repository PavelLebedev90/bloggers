import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { authService } from "../service/auth.service";
import { ResultSuccessStatus } from "../../../core/types/result.type";

export const registrationConfirmAuthHandler = async (
  _req: Request,
  res: Response<
    ValidationErrorMessages | undefined,
    {
      body: {
        code: string;
      };
    }
  >,
) => {
  const result = await authService.registrationConfirmAuth(res.locals.body.code);
  if (isError(result)) return sendResult(res, result);
  sendResult<ResultSuccessStatus.NoContent>(res, {
    ...result,
    status: ResultSuccessStatus.NoContent,
  });
};
