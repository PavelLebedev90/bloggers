import { BlogDBModel } from "../types/blogs-db.type";
import { BlogInputModel } from "../types/blogs-input.type";

export const blogToDBMapper = (
  blog: BlogInputModel,
): Omit<BlogDBModel, "createdAt" | "isMembership"> => {
  return {
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
  };
};
