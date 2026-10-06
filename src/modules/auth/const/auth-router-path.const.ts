import { config } from "../../../core/config/setup.config";

export const AUTH_ROUTER = {
  ROOT: "/auth",
  BASE: "/",
  LOGIN: "/login",
} as const;

export const AUTH_ROUTER_PATH = `${config.basePath}${AUTH_ROUTER.ROOT}`;
