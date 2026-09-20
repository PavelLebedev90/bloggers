import { Router } from "express";
import { POSTS_ROUTER } from "./const/posts-router-path.const";
import { getPostHandler } from "./handlers/get-post.handler";
import { getAllPostsHandler } from "./handlers/get-all-posts.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { baseAuthorizationMiddleWare } from "../../core/middlewares/auth/base-authorization.middleware";

export const postsRouter: Router = Router();

postsRouter.get(POSTS_ROUTER.BASE, getAllPostsHandler);
postsRouter.get(POSTS_ROUTER.BY_ID, getPostHandler);
postsRouter.post(POSTS_ROUTER.BASE, baseAuthorizationMiddleWare, createPostHandler);
postsRouter.put(POSTS_ROUTER.BY_ID, baseAuthorizationMiddleWare, updatePostHandler);
postsRouter.delete(POSTS_ROUTER.BY_ID, baseAuthorizationMiddleWare, deletePostHandler);
