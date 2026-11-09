import { Response } from "express";
import { authService } from "../service/auth.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { SanitizedRequest } from "../../../core/types/express.type";

export const updatePasswordHandler = async (
  req: SanitizedRequest<{
    recoveryCode: string;
    newPassword: string;
  }>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const result = await authService.updatePassword(
    req.validData.body.recoveryCode,
    req.validData.body.newPassword,
  );
  sendResult({ res, result });
};
