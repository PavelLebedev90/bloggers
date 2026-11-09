import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authService } from "../service/auth.service";
import { SanitizedRequest } from "../../../core/types/express.type";

export const registrationEmailResendingAuthHandler = async (
  req: SanitizedRequest<{
    email: string;
  }>,
  res: Response<ValidationErrorMessages | undefined>,
) => {
  const result = await authService.registrationEmailResendingAuth(req.validData.body.email);
  sendResult({ res, result });
};
