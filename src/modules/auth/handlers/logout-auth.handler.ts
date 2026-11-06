import { Response, Request } from "express";
import { authService } from "../service/auth.service";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { clearRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";

export const logoutHandler = async (
  req: Request,
  res: Response<
    undefined | ValidationErrorMessages,
    {
      cookie: {
        userId: string;
        deviceId: string;
      };
    }
  >,
) => {
  const result = await authService.logout(res.locals.cookie.deviceId, res.locals.cookie.userId);
  if (isError(result)) {
    return sendError({ res, httpStatus: HttpStatus.Unauthorized, errors: result.extensions });
  }
  clearRefreshCookie(req, res);
  sendResult({ res, result });
};
