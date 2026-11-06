import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { AuthInputModel } from "../types/auth-input.type";
import { authService } from "../service/auth.service";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authTokenToOutputMapper } from "../mappers/auth-to-output.mapper";
import { setRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { collectMetaRequest } from "../../../core/helpers/collect-meta-request.helper";

export const loginHandler = async (
  req: Request,
  res: Response<
    { accessToken: string } | ValidationErrorMessages,
    {
      body: AuthInputModel;
    }
  >,
) => {
  const meta = collectMetaRequest(req);
  const result = await authService.login(res.locals.body, meta);
  if (isError(result))
    return sendError({ res, httpStatus: HttpStatus[result.status], errors: result.extensions });
  setRefreshCookie(req, res, result.data.refreshToken.token, result.data.refreshToken.exp);
  sendResult({ res, result, mapper: authTokenToOutputMapper });
};
