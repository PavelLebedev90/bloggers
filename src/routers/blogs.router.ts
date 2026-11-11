import { Router } from "express";
import { BLOGS_ROUTER } from "../modules/blogs/const/blogs-router-path.const";
import { baseAuthorizationMiddleWare } from "../core/middlewares/auth/base-authorization.middleware";
import {
  blogCreateScheme,
  blogParamsScheme,
  blogQueryScheme,
  blogUpdateScheme,
} from "../modules/blogs/middlewares/validation/blogs-input-scheme.middleware";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import {
  postCreateScheme,
  postQueryScheme,
} from "../modules/posts/middlewares/validation/posts-input-scheme.middleware";
import { BlogsController } from "../modules/blogs/controller/blogs.controller";
import { container } from "../composition-root";

export const blogsRouter: Router = Router();
const blogsController = container.get(BlogsController);

blogsRouter.get(
  BLOGS_ROUTER.BASE,
  captureErrorValidation(blogQueryScheme),
  blogsController.getAllBlogs.bind(blogsController),
);
blogsRouter.get(
  BLOGS_ROUTER.BY_ID,
  captureErrorValidation(blogParamsScheme("id")),
  blogsController.getBlog.bind(blogsController),
);
blogsRouter.get(
  BLOGS_ROUTER.POSTS_BY_BLOG_ID,
  captureErrorValidation(postQueryScheme.extend(blogParamsScheme("blogId").shape)),
  blogsController.getPostsByBlogId.bind(blogsController),
);

blogsRouter.use(baseAuthorizationMiddleWare);
blogsRouter.post(
  BLOGS_ROUTER.POSTS_BY_BLOG_ID,
  captureErrorValidation(postCreateScheme.extend(blogParamsScheme("blogId").shape)),
  blogsController.createPostByBlogId.bind(blogsController),
);
blogsRouter.post(
  BLOGS_ROUTER.BASE,
  captureErrorValidation(blogCreateScheme),
  blogsController.createBlog.bind(blogsController),
);
blogsRouter.put(
  BLOGS_ROUTER.BY_ID,
  captureErrorValidation(blogUpdateScheme.extend(blogParamsScheme("id").shape)),
  blogsController.updateBlog.bind(blogsController),
);
blogsRouter.delete(
  BLOGS_ROUTER.BY_ID,
  captureErrorValidation(blogParamsScheme("id")),
  blogsController.deleteBlog.bind(blogsController),
);
