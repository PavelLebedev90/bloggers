import { Router } from "express";
import { POSTS_ROUTER } from "../modules/posts/const/posts-router-path.const";
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
import { bearerAuthorizationMiddleWare } from "../core/middlewares/auth/bearer-authorization.middleware";
import { PostsController } from "../modules/posts/controller/posts.controller";
import { container } from "../composition-root";

export const postsRouter: Router = Router();
const postsController = container.get(PostsController);

postsRouter.get(
  POSTS_ROUTER.BASE,
  captureErrorValidation(postQueryScheme),
  postsController.getAllPosts.bind(postsController),
);
postsRouter.get(
  POSTS_ROUTER.BY_ID,
  captureErrorValidation(postParamsScheme("id")),
  postsController.getPost.bind(postsController),
);

postsRouter.get(
  POSTS_ROUTER.COMMENTS_BY_POST_ID,
  captureErrorValidation(commentQueryScheme.extend(postParamsScheme("postId").shape)),
  postsController.getCommentsByPostId.bind(postsController),
);
postsRouter.post(
  POSTS_ROUTER.COMMENTS_BY_POST_ID,
  bearerAuthorizationMiddleWare,
  captureErrorValidation(commentCreateScheme.extend(postParamsScheme("postId").shape)),
  postsController.createCommentByPostId.bind(postsController),
);

postsRouter.use(baseAuthorizationMiddleWare);
postsRouter.post(
  POSTS_ROUTER.BASE,
  captureErrorValidation(postCreateSchemeWithBlogId),
  postsController.createPost.bind(postsController),
);
postsRouter.put(
  POSTS_ROUTER.BY_ID,
  captureErrorValidation(postUpdateScheme.extend(postParamsScheme("id").shape)),
  postsController.updatePost.bind(postsController),
);
postsRouter.delete(
  POSTS_ROUTER.BY_ID,
  captureErrorValidation(postParamsScheme("id")),
  postsController.deletePost.bind(postsController),
);
