import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { authService } from "../service/auth.service";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authTokenToOutputMapper } from "../mappers/auth-to-output.mapper";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { setRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";

export const refreshTokenHandler = async (
  req: Request,
  res: Response<
    { accessToken: string } | ValidationErrorMessages,
    {
      cookie: {
        userId: string;
        deviceId: string;
      };
    }
  >,
) => {
  const result = await authService.refreshToken(
    res.locals.cookie.deviceId,
    res.locals.cookie.userId,
  );
  if (isError(result))
    return sendError({ res, httpStatus: HttpStatus[result.status], errors: result.extensions });
  setRefreshCookie(req, res, result.data.refreshToken.token, result.data.refreshToken.exp);
  sendResult({ res, result, mapper: authTokenToOutputMapper });
};
