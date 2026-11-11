import { Router } from "express";
import { SECURITY_DEVICES_ROUTER } from "../modules/securityDevices/const/securityDevices-router-path.const";
import { cookieRefreshTokenMiddleWare } from "../core/middlewares/auth/cookie-refresh-token.middleware";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { securityDevicesParamsScheme } from "../modules/securityDevices/middlewares/validation/securityDevices-scheme.middleware";
import { container } from "../composition-root";
import { SecurityDevicesController } from "../modules/securityDevices/controller/securityDevices.controller";

export const securityDevicesRouter: Router = Router();
const securityDevicesController = container.get(SecurityDevicesController);

securityDevicesRouter.get(
  SECURITY_DEVICES_ROUTER.BASE,
  cookieRefreshTokenMiddleWare,
  securityDevicesController.getSecurityDevices.bind(securityDevicesController),
);
securityDevicesRouter.delete(
  SECURITY_DEVICES_ROUTER.BASE,
  cookieRefreshTokenMiddleWare,
  securityDevicesController.deleteAllSessionExcludeCurrent.bind(securityDevicesController),
);
securityDevicesRouter.delete(
  SECURITY_DEVICES_ROUTER.BY_ID,
  cookieRefreshTokenMiddleWare,
  captureErrorValidation(securityDevicesParamsScheme),
  securityDevicesController.deleteSessionByDeviceId.bind(securityDevicesController),
);
