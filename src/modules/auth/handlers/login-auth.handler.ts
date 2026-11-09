import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { authService } from "../service/auth.service";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authTokenToOutputMapper } from "../mappers/auth-to-output.mapper";
import { setRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { collectMetaRequest } from "../../../core/helpers/collect-meta-request.helper";
import { SanitizedRequest } from "../../../core/types/express.type";
import { AuthInputModel } from "../types/auth-input.type";

export const loginHandler = async (
  req: SanitizedRequest<AuthInputModel>,
  res: Response<{ accessToken: string } | ValidationErrorMessages>,
) => {
  const meta = collectMetaRequest(req);
  const result = await authService.login(req.validData.body, meta);
  if (isError(result))
    return sendError({ res, httpStatus: HttpStatus[result.status], errors: result.extensions });
  setRefreshCookie(req, res, result.data.refreshToken.token, result.data.refreshToken.exp);
  sendResult({ res, result, mapper: authTokenToOutputMapper });
};
