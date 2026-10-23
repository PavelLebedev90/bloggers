import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { authService } from "../service/auth.service";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authTokenToOutputMapper } from "../mappers/auth-to-output.mapper";
import { usersQueryRepository } from "../../users/repository/users-query.repository";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { cookieEnv } from "../../../core/config/cookie.config";
import { setRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";

export const refreshTokenHandler = async (
  req: Request,
  res: Response<
    { accessToken: string } | ValidationErrorMessages,
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
  const result = await authService.refreshToken(
    refreshToken,
    res.locals.cookie.exp,
    userResult.data,
  );
  if (isError(result))
    return sendError({ res, httpStatus: HttpStatus[result.status], errors: result.extensions });
  setRefreshCookie(req, res, result.data.refreshToken.token, result.data.refreshToken.exp);
  sendResult({ res, result, mapper: authTokenToOutputMapper });
};
