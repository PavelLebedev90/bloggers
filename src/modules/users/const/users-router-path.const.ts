import { config } from "../../../core/config/setup.config";

export const USERS_ROUTER = {
  ROOT: "/users",
  BASE: "/",
  BY_ID: "/:id",
} as const;

export const USERS_ROUTER_PATH = `${config.basePath}${USERS_ROUTER.ROOT}`;
