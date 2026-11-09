import { config } from "../../../core/config/setup.config";

export const RATE_LIMITS_ROUTER = {
  ROOT: "/rate-limits",
} as const;

export const RATE_LIMITS_ROUTER_ROUTER_PATH = `${config.basePath}${RATE_LIMITS_ROUTER.ROOT}`;
