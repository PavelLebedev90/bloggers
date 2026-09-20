import { BlogDBModel } from "../types/blogs-db.type";
import { BlogCreateModel } from "../types/blogs-input.type";

export const blogToDBMapper = (newBlogId: string, blog: BlogCreateModel): BlogDBModel => {
  return {
    id: newBlogId,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
  };
};
