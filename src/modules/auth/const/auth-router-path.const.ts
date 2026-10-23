import { config } from "../../../core/config/setup.config";

export const AUTH_ROUTER = {
  ROOT: "/auth",
  BASE: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",
  REFRESH_TOKEN: "/refresh-token",
  ME: "/me",
  REGISTRATION: "/registration",
  REGISTRATION_CONFIRM: "/registration-confirmation",
  REGISTRATION_EMAIL_RESENDING: "/registration-email-resending",
} as const;

export const AUTH_ROUTER_PATH = `${config.basePath}${AUTH_ROUTER.ROOT}`;
