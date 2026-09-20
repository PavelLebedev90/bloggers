import { BASE_PATH } from "../../../core/config/base-path.config";

export const POSTS_ROUTER = {
  ROOT: "/posts",
  BASE: "/",
  BY_ID: "/:id",
} as const;

export const POSTS_ROUTER_PATH = `${BASE_PATH}${POSTS_ROUTER.ROOT}`;
