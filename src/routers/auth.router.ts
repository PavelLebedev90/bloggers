import { Router, Request, Response } from "express";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { AUTH_ROUTER } from "../modules/auth/const/auth-router-path.const";
import {
  authConfirmationScheme,
  authEmailResendingScheme,
  authScheme,
} from "../modules/auth/middlewares/validation/auth-input-scheme.middleware";
import { loginHandler } from "../modules/auth/handlers/login-auth.handler";
import { getMeHandler } from "../modules/auth/handlers/get-me-auth.handler";
import { bearerAuthorizationMiddleWare } from "../core/middlewares/auth/bearer-authorization.middleware";
import { bearerJWEAuthorizationMiddleWare } from "../core/middlewares/auth/bearer-jwe-authorization.middleware";
import { AuthInputModel } from "../modules/auth/types/auth-input.type";
import { ValidationErrorMessages } from "../core/types/validation-error.type";
import { authService } from "../modules/auth/service/auth.service";
import { sendResult } from "../core/utils/formatters/result/send-result.formatter";
import {
  authTokenToOutputMapper,
  authToOutputMapper,
} from "../modules/auth/mappers/auth-to-output.mapper";
import { AuthOutputModel } from "../modules/auth/types/auth-output.type";
import { usersQueryRepository } from "../modules/users/repository/users-query.repository";
import { UserOutputModel } from "../modules/users/types/users-output.type";
import { userCreateScheme } from "../modules/users/middlewares/validation/users-input-scheme.middleware";
import { registrationAuthHandler } from "../modules/auth/handlers/registration-auth.handler";
import { registrationConfirmAuthHandler } from "../modules/auth/handlers/registration-confirm-auth.handler";
import { registrationEmailResendingAuthHandler } from "../modules/auth/handlers/registration-email-resending-auth.handler";
import { logoutHandler } from "../modules/auth/handlers/logout-auth.handler";
import { refreshTokenHandler } from "../modules/auth/handlers/refresh-token-auth.handler";
import { cookieRefreshTokenMiddleWare } from "../core/middlewares/auth/cookie-refresh-token.middleware";

export const authRouter: Router = Router();

authRouter.get(AUTH_ROUTER.ME, bearerAuthorizationMiddleWare, getMeHandler);
authRouter.post(AUTH_ROUTER.LOGIN, captureErrorValidation(authScheme), loginHandler);
authRouter.post(AUTH_ROUTER.LOGOUT, cookieRefreshTokenMiddleWare, logoutHandler);
authRouter.post(AUTH_ROUTER.REFRESH_TOKEN, cookieRefreshTokenMiddleWare, refreshTokenHandler);
authRouter.post(
  AUTH_ROUTER.REGISTRATION,
  captureErrorValidation(userCreateScheme),
  registrationAuthHandler,
);
authRouter.post(
  AUTH_ROUTER.REGISTRATION_CONFIRM,
  captureErrorValidation(authConfirmationScheme),
  registrationConfirmAuthHandler,
);
authRouter.post(
  AUTH_ROUTER.REGISTRATION_EMAIL_RESENDING,
  captureErrorValidation(authEmailResendingScheme),
  registrationEmailResendingAuthHandler,
);

authRouter.get(
  `${AUTH_ROUTER.ME}/jwe`,
  bearerJWEAuthorizationMiddleWare,
  async (
    _req: Request,
    res: Response<
      AuthOutputModel | ValidationErrorMessages,
      {
        user: UserOutputModel;
      }
    >,
  ) => {
    const user = await usersQueryRepository.getUser(res.locals.user.id);
    sendResult(res, user, authToOutputMapper);
  },
);
authRouter.post(
  `${AUTH_ROUTER.LOGIN}/jwe`,
  captureErrorValidation(authScheme),
  async (
    _req: Request,
    res: Response<
      { accessToken: string } | ValidationErrorMessages,
      {
        body: AuthInputModel;
      }
    >,
  ) => {
    const result = await authService.login(res.locals.body, "jwe");
    sendResult(res, result, authTokenToOutputMapper);
  },
);
