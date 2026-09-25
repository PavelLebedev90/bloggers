import { config } from "../../../core/config/setup.config";

export const POSTS_ROUTER = {
  ROOT: "/posts",
  BASE: "/",
  BY_ID: "/:id",
} as const;

export const POSTS_ROUTER_PATH = `${config.basePath}${POSTS_ROUTER.ROOT}`;
