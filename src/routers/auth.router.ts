import { Router } from "express";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { AUTH_ROUTER } from "../modules/auth/const/auth-router-path.const";
import {
  authConfirmationScheme,
  authEmailResendingScheme,
  authNewPasswordScheme,
  authScheme,
} from "../modules/auth/middlewares/validation/auth-input-scheme.middleware";
import { bearerAuthorizationMiddleWare } from "../core/middlewares/auth/bearer-authorization.middleware";
import { bearerJWEAuthorizationMiddleWare } from "../core/middlewares/auth/bearer-jwe-authorization.middleware";
import { userCreateScheme } from "../modules/users/middlewares/validation/users-input-scheme.middleware";
import { cookieRefreshTokenMiddleWare } from "../core/middlewares/auth/cookie-refresh-token.middleware";
import { rateLimitMiddleware } from "../core/middlewares/rateLimit/rate-limit.middleware";
import { container } from "../composition-root";
import { AuthController } from "../modules/auth/controller/auth.controller";

export const authRouter: Router = Router();
const authController = container.get(AuthController);

authRouter.get(
  AUTH_ROUTER.ME,
  bearerAuthorizationMiddleWare,
  authController.getMe.bind(authController),
);
authRouter.post(
  AUTH_ROUTER.LOGIN,
  captureErrorValidation(authScheme),
  rateLimitMiddleware,
  authController.login.bind(authController),
);
authRouter.post(
  AUTH_ROUTER.LOGOUT,
  cookieRefreshTokenMiddleWare,
  authController.logout.bind(authController),
);
authRouter.post(
  AUTH_ROUTER.REFRESH_TOKEN,
  cookieRefreshTokenMiddleWare,
  authController.refreshToken.bind(authController),
);
authRouter.post(
  AUTH_ROUTER.REGISTRATION,
  captureErrorValidation(userCreateScheme),
  rateLimitMiddleware,
  authController.registration.bind(authController),
);
authRouter.post(
  AUTH_ROUTER.REGISTRATION_CONFIRM,
  captureErrorValidation(authConfirmationScheme),
  rateLimitMiddleware,
  authController.registrationConfirm.bind(authController),
);
authRouter.post(
  AUTH_ROUTER.REGISTRATION_EMAIL_RESENDING,
  captureErrorValidation(authEmailResendingScheme),
  rateLimitMiddleware,
  authController.registrationEmailResending.bind(authController),
);
authRouter.post(
  AUTH_ROUTER.PASSWORD_RECOVERY,
  captureErrorValidation(authEmailResendingScheme),
  rateLimitMiddleware,
  authController.passwordRecovery.bind(authController),
);
authRouter.post(
  AUTH_ROUTER.NEW_PASSWORD,
  captureErrorValidation(authNewPasswordScheme),
  rateLimitMiddleware,
  authController.updatePassword.bind(authController),
);

authRouter.get(
  `${AUTH_ROUTER.ME}/jwe`,
  bearerJWEAuthorizationMiddleWare,
  authController.getMeJWE.bind(authController),
);
authRouter.post(
  `${AUTH_ROUTER.LOGIN}/jwe`,
  captureErrorValidation(authScheme),
  rateLimitMiddleware,
  authController.loginJWE.bind(authController),
);
