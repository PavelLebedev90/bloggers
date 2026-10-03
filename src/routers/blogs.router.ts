import { Router } from "express";
import { BLOGS_ROUTER } from "../modules/blogs/const/blogs-router-path.const";
import { getAllBlogsHandler } from "../modules/blogs/handlers/get-all-blogs.handler";
import { getBlogHandler } from "../modules/blogs/handlers/get-blog.handler";
import { createBlogHandler } from "../modules/blogs/handlers/create-blog.handler";
import { updateBlogHandler } from "../modules/blogs/handlers/update-blog.handler";
import { deleteBlogHandler } from "../modules/blogs/handlers/delete-blog.handler";
import { baseAuthorizationMiddleWare } from "../core/middlewares/auth/base-authorization.middleware";
import {
  blogCreateScheme,
  blogParamsScheme,
  blogQueryScheme,
  blogUpdateScheme,
} from "../modules/blogs/middlewares/validation/blogs-input-scheme.middleware";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { getPostsByBlogIdHandler } from "../modules/blogs/handlers/get-posts-by-blogId.handler";
import {
  postCreateScheme,
  postQueryScheme,
} from "../modules/posts/middlewares/validation/posts-input-scheme.middleware";
import { createPostByBlogIdHandler } from "../modules/blogs/handlers/create-post-by-blogId.handler";

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
