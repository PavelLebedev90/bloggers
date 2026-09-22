import { BASE_PATH } from "../../../core/config/setup.config";

export const BLOGS_ROUTER = {
  ROOT: "/blogs",
  BASE: "/",
  BY_ID: "/:id",
} as const;

export const BLOGS_ROUTER_PATH = `${BASE_PATH}${BLOGS_ROUTER.ROOT}`;
