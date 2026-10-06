import { Router } from "express";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { AUTH_ROUTER } from "../modules/auth/const/auth-router-path.const";
import { authScheme } from "../modules/auth/middlewares/validation/auth-input-scheme.middleware";
import { loginHandler } from "../modules/auth/handlers/login-auth.handler";

export const authRouter: Router = Router();

authRouter.post(AUTH_ROUTER.LOGIN, captureErrorValidation(authScheme), loginHandler);
