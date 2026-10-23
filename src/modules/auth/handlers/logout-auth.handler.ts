import { Response, Request } from "express";
import { authService } from "../service/auth.service";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { clearRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";
import { cookieEnv } from "../../../core/config/cookie.config";
import { ResultSuccessStatus } from "../../../core/types/result.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { usersQueryRepository } from "../../users/repository/users-query.repository";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";

export const logoutHandler = async (
  req: Request,
  res: Response<
    undefined | ValidationErrorMessages,
    {
      cookie: {
        userId: string;
        exp: number;
      };
    }
  >,
) => {
  const userResult = await usersQueryRepository.getUser(res.locals.cookie.userId);
  if (isError(userResult)) {
    return sendError({ res, httpStatus: HttpStatus.Unauthorized, errors: userResult.extensions });
  }
  const refreshToken = req.cookies[cookieEnv.REFRESH_NAME] as string;
  const result = await authService.logout(refreshToken, res.locals.cookie.exp, userResult.data.id);
  if (isError(result)) {
    return sendError({ res, httpStatus: HttpStatus.Unauthorized, errors: result.extensions });
  }
  clearRefreshCookie(req, res);
  sendResult({ res, result, overwriteSuccessStatus: ResultSuccessStatus.NoContent });
};
