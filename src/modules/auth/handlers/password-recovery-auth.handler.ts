import { Response } from "express";
import { authService } from "../service/auth.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { SanitizedRequest } from "../../../core/types/express.type";

export const passwordRecoveryHandler = async (
  req: SanitizedRequest<{
    email: string;
  }>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const result = await authService.passwordRecoveryAuth(req.validData.body.email);
  sendResult({ res, result });
};
