import { Router } from "express";
import { BLOGS_ROUTER } from "./const/blogs-router-path.const";
import { getAllBlogsHandler } from "./handlers/get-all-blogs.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { baseAuthorizationMiddleWare } from "../../core/middlewares/auth/base-authorization.middleware";
import {
  blogCreateScheme,
  blogParamsScheme,
  blogQueryScheme,
  blogUpdateScheme,
} from "./middlewares/validation/blogs-input-scheme.middleware";
import { captureErrorValidation } from "../../core/middlewares/validation/capture-error-validation.middleware";
import { getPostsByBlogIdHandler } from "./handlers/get-posts-by-blogId.handler";
import {
  postCreateScheme,
  postQueryScheme,
} from "../posts/middlewares/validation/posts-input-scheme.middleware";
import { createPostByBlogIdHandler } from "./handlers/create-post-by-blogId.handler";

export const blogsRouter: Router = Router();

blogsRouter.get(BLOGS_ROUTER.BASE, captureErrorValidation(blogQueryScheme), getAllBlogsHandler);
blogsRouter.get(BLOGS_ROUTER.BY_ID, captureErrorValidation(blogParamsScheme("id")), getBlogHandler);
blogsRouter.get(
  BLOGS_ROUTER.POSTS_BY_BLOG_ID,
  captureErrorValidation(postQueryScheme.extend(blogParamsScheme("blogId").shape)),
  getPostsByBlogIdHandler,
);
blogsRouter.post(
  BLOGS_ROUTER.POSTS_BY_BLOG_ID,
  baseAuthorizationMiddleWare,
  captureErrorValidation(postCreateScheme.extend(blogParamsScheme("blogId").shape)),
  createPostByBlogIdHandler,
);
blogsRouter.post(
  BLOGS_ROUTER.BASE,
  baseAuthorizationMiddleWare,
  captureErrorValidation(blogCreateScheme),
  createBlogHandler,
);
blogsRouter.put(
  BLOGS_ROUTER.BY_ID,
  baseAuthorizationMiddleWare,
  captureErrorValidation(blogUpdateScheme.extend(blogParamsScheme("id").shape)),
  updateBlogHandler,
);
blogsRouter.delete(
  BLOGS_ROUTER.BY_ID,
  baseAuthorizationMiddleWare,
  captureErrorValidation(blogParamsScheme("id")),
  deleteBlogHandler,
);
