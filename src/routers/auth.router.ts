import { Router, Request, Response } from "express";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { AUTH_ROUTER } from "../modules/auth/const/auth-router-path.const";
import { authScheme } from "../modules/auth/middlewares/validation/auth-input-scheme.middleware";
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

export const authRouter: Router = Router();

authRouter.get(AUTH_ROUTER.ME, bearerAuthorizationMiddleWare, getMeHandler);
authRouter.post(AUTH_ROUTER.LOGIN, captureErrorValidation(authScheme), loginHandler);

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
