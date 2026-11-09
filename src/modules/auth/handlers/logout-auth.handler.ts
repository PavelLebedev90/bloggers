import { Response } from "express";
import { authService } from "../service/auth.service";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { clearRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { SessionRequest } from "../../../core/types/express.type";
import { JWTType, JWTUserInfo } from "../../../core/adapters/jwt.adapter";

export const logoutHandler = async (
  req: SessionRequest<JWTUserInfo<JWTType.REFRESH>>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const result = await authService.logout(req.userSession.deviceId, req.userSession.userId);
  if (isError(result)) {
    return sendError({ res, httpStatus: HttpStatus.Unauthorized, errors: result.extensions });
  }
  clearRefreshCookie(req, res);
  sendResult({ res, result });
};
