import { config } from "../../../core/config/setup.config";

export const SECURITY_DEVICES_ROUTER = {
  ROOT: "/security/devices",
  BASE: "/",
  BY_ID: "/:deviceId",
} as const;

export const SECURITY_DEVICES_ROUTER_PATH = `${config.basePath}${SECURITY_DEVICES_ROUTER.ROOT}`;
