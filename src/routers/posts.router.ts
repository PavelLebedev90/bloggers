import { Router } from "express";
import { POSTS_ROUTER } from "../modules/posts/const/posts-router-path.const";
import { getPostHandler } from "../modules/posts/handlers/get-post.handler";
import { getAllPostsHandler } from "../modules/posts/handlers/get-all-posts.handler";
import { createPostHandler } from "../modules/posts/handlers/create-post.handler";
import { updatePostHandler } from "../modules/posts/handlers/update-post.handler";
import { deletePostHandler } from "../modules/posts/handlers/delete-post.handler";
import { baseAuthorizationMiddleWare } from "../core/middlewares/auth/base-authorization.middleware";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import {
  postCreateSchemeWithBlogId,
  postParamsScheme,
  postQueryScheme,
  postUpdateScheme,
} from "../modules/posts/middlewares/validation/posts-input-scheme.middleware";

export const postsRouter: Router = Router();

postsRouter.get(POSTS_ROUTER.BASE, captureErrorValidation(postQueryScheme), getAllPostsHandler);
postsRouter.get(POSTS_ROUTER.BY_ID, captureErrorValidation(postParamsScheme), getPostHandler);
postsRouter.post(
  POSTS_ROUTER.BASE,
  baseAuthorizationMiddleWare,
  captureErrorValidation(postCreateSchemeWithBlogId),
  createPostHandler,
);
postsRouter.put(
  POSTS_ROUTER.BY_ID,
  baseAuthorizationMiddleWare,
  captureErrorValidation(postUpdateScheme.extend(postParamsScheme.shape)),
  updatePostHandler,
);
postsRouter.delete(
  POSTS_ROUTER.BY_ID,
  baseAuthorizationMiddleWare,
  captureErrorValidation(postParamsScheme),
  deletePostHandler,
);
