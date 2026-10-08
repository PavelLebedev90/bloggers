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
import {
  commentCreateScheme,
  commentQueryScheme,
} from "../modules/comments/middlewares/validation/comments-input-scheme.middleware";
import { getCommentsByPostIdHandler } from "../modules/posts/handlers/get-comments-by-postId.handler";
import { createCommentByPostIdHandler } from "../modules/posts/handlers/create-comment-by-postId.handler";
import { bearerAuthorizationMiddleWare } from "../core/middlewares/auth/bearer-authorization.middleware";

export const postsRouter: Router = Router();

postsRouter.get(POSTS_ROUTER.BASE, captureErrorValidation(postQueryScheme), getAllPostsHandler);
postsRouter.get(POSTS_ROUTER.BY_ID, captureErrorValidation(postParamsScheme("id")), getPostHandler);

postsRouter.get(
  POSTS_ROUTER.COMMENTS_BY_POST_ID,
  captureErrorValidation(commentQueryScheme.extend(postParamsScheme("postId").shape)),
  getCommentsByPostIdHandler,
);
postsRouter.post(
  POSTS_ROUTER.COMMENTS_BY_POST_ID,
  bearerAuthorizationMiddleWare,
  captureErrorValidation(commentCreateScheme.extend(postParamsScheme("postId").shape)),
  createCommentByPostIdHandler,
);

postsRouter.use(baseAuthorizationMiddleWare);
postsRouter.post(
  POSTS_ROUTER.BASE,
  captureErrorValidation(postCreateSchemeWithBlogId),
  createPostHandler,
);
postsRouter.put(
  POSTS_ROUTER.BY_ID,
  captureErrorValidation(postUpdateScheme.extend(postParamsScheme("id").shape)),
  updatePostHandler,
);
postsRouter.delete(
  POSTS_ROUTER.BY_ID,
  captureErrorValidation(postParamsScheme("id")),
  deletePostHandler,
);
