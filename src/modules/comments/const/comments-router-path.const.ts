import { config } from "../../../core/config/setup.config";

export const COMMENTS_ROUTER = {
  ROOT: "/comments",
  BASE: "/",
  BY_ID: "/:commentId",
} as const;

export const COMMENTS_ROUTER_PATH = `${config.basePath}${COMMENTS_ROUTER.ROOT}`;
