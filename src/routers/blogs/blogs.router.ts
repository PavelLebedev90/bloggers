import { Router } from "express";
import { BLOGS_ROUTER } from "./const/blogs-router-path.const";
import { getAllBlogsHandler } from "./handlers/get-all-blogs.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";

export const blogsRouter: Router = Router();

blogsRouter.get(BLOGS_ROUTER.BASE, getAllBlogsHandler);
blogsRouter.get(BLOGS_ROUTER.BY_ID, getBlogHandler);
blogsRouter.post(BLOGS_ROUTER.BASE, createBlogHandler);
blogsRouter.put(BLOGS_ROUTER.BY_ID, updateBlogHandler);
blogsRouter.delete(BLOGS_ROUTER.BY_ID, deleteBlogHandler);
