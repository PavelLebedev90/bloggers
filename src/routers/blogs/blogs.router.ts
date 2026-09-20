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
  blogUpdateScheme,
} from "./middlewares/validation/blogs-input-scheme.middleware";
import { captureErrorValidation } from "../../core/middlewares/validation/capture-error-validation.middleware";

export const blogsRouter: Router = Router();

blogsRouter.get(BLOGS_ROUTER.BASE, getAllBlogsHandler);
blogsRouter.get(BLOGS_ROUTER.BY_ID, captureErrorValidation(blogParamsScheme), getBlogHandler);
blogsRouter.post(
  BLOGS_ROUTER.BASE,
  baseAuthorizationMiddleWare,
  captureErrorValidation(blogCreateScheme),
  createBlogHandler,
);
blogsRouter.put(
  BLOGS_ROUTER.BY_ID,
  baseAuthorizationMiddleWare,
  captureErrorValidation(blogUpdateScheme.merge(blogParamsScheme)),
  updateBlogHandler,
);
blogsRouter.delete(
  BLOGS_ROUTER.BY_ID,
  baseAuthorizationMiddleWare,
  captureErrorValidation(blogParamsScheme),
  deleteBlogHandler,
);
