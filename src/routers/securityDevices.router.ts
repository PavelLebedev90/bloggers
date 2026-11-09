import { Router } from "express";
import { SECURITY_DEVICES_ROUTER } from "../modules/securityDevices/const/securityDevices-router-path.const";
import { getSecurityDevicesHandler } from "../modules/securityDevices/handlers/get-securityDevices.handler";
import { deleteSecurityDeviceHandler } from "../modules/securityDevices/handlers/delete-securityDevice.handler";
import { deleteSecurityDevicesHandler } from "../modules/securityDevices/handlers/delete-securityDevices.handler";
import { cookieRefreshTokenMiddleWare } from "../core/middlewares/auth/cookie-refresh-token.middleware";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { securityDevicesParamsScheme } from "../modules/securityDevices/middlewares/validation/securityDevices-scheme.middleware";

export const securityDevicesRouter: Router = Router();

securityDevicesRouter.get(
  SECURITY_DEVICES_ROUTER.BASE,
  cookieRefreshTokenMiddleWare,
  getSecurityDevicesHandler,
);
securityDevicesRouter.delete(
  SECURITY_DEVICES_ROUTER.BASE,
  cookieRefreshTokenMiddleWare,
  deleteSecurityDevicesHandler,
);
securityDevicesRouter.delete(
  SECURITY_DEVICES_ROUTER.BY_ID,
  cookieRefreshTokenMiddleWare,
  captureErrorValidation(securityDevicesParamsScheme),
  deleteSecurityDeviceHandler,
);
