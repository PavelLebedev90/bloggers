import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { authService } from "../service/auth.service";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authTokenToOutputMapper } from "../mappers/auth-to-output.mapper";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { setRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";
import { SessionRequest } from "../../../core/types/express.type";
import { JWTType, JWTUserInfo } from "../../../core/adapters/jwt.adapter";

export const refreshTokenHandler = async (
  req: SessionRequest<JWTUserInfo<JWTType.REFRESH>>,
  res: Response<{ accessToken: string } | ValidationErrorMessages>,
) => {
  const result = await authService.refreshToken(req.userSession.deviceId, req.userSession.userId);
  if (isError(result))
    return sendError({ res, httpStatus: HttpStatus[result.status], errors: result.extensions });
  setRefreshCookie(req, res, result.data.refreshToken.token, result.data.refreshToken.exp);
  sendResult({ res, result, mapper: authTokenToOutputMapper });
};
