import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authService } from "../service/auth.service";
import { SanitizedRequest } from "../../../core/types/express.type";

export const registrationConfirmAuthHandler = async (
  req: SanitizedRequest<{
    code: string;
  }>,
  res: Response<ValidationErrorMessages | undefined>,
) => {
  const result = await authService.registrationConfirmAuth(req.validData.body.code);
  sendResult({ res, result });
};
