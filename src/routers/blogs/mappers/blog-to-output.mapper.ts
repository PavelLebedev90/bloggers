import { BlogDBModel } from "../types/blogs-db.type";
import { BlogResponseModel } from "../types/blogs-output.type";

export const blogToOutputMapper = (blog: BlogDBModel): BlogResponseModel => {
  const { id, description, name, websiteUrl } = blog;
  return {
    id,
    description,
    name,
    websiteUrl,
  };
};

export const blogsToOutputMapper = (dbData: BlogDBModel[]) => {
  return dbData.map(blogToOutputMapper);
};
