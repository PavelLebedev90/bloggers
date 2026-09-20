import { nanoid } from "nanoid";
import { db } from "../../../db/db-bloggers";
import { BlogCreateModel, BlogUpdateModel } from "../types/blogs-input.type";
import { blogsToOutputMapper, blogToOutputMapper } from "../mappers/blog-to-output.mapper";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";

export const blogsRepository = {
  getAll() {
    return blogsToOutputMapper(db.blogs);
  },
  getBlog(blogId: string) {
    const blog = db.blogs.find((blog) => blog.id === blogId) ?? null;
    if (blog) {
      return blogToOutputMapper(blog);
    }
    return blog;
  },
  createBlog(bodyBlog: BlogCreateModel) {
    const id = nanoid(10);

    const newBlog = blogToDBMapper(id, bodyBlog);
    db.blogs.push(newBlog);

    return blogToOutputMapper(newBlog);
  },
  updateBlog(blogId: string, bodyBlog: BlogUpdateModel) {
    const dbBlog = db.blogs.find((blog) => blog.id === blogId);
    if (!dbBlog) {
      return false;
    }

    dbBlog.name = bodyBlog.name;
    dbBlog.description = bodyBlog.description;
    dbBlog.websiteUrl = bodyBlog.websiteUrl;

    return true;
  },
  deleteBlog(blogId: string) {
    const blogIdx = db.blogs.findIndex((blog) => blog.id === blogId);

    if (blogIdx === -1) {
      return false;
    }
    db.blogs.splice(blogIdx, 1);
    return true;
  },
};
