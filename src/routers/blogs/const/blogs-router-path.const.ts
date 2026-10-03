import { config } from "../../../core/config/setup.config";

export const BLOGS_ROUTER = {
  ROOT: "/blogs",
  BASE: "/",
  BY_ID: "/:id",
  POSTS_BY_BLOG_ID: "/:blogId/posts",
} as const;

export const BLOGS_ROUTER_PATH = `${config.basePath}${BLOGS_ROUTER.ROOT}`;
