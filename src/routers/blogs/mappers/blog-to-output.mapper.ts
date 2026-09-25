import { WithId } from "mongodb";
import { BlogDBModel } from "../types/blogs-db.type";
import { BlogOutputModel } from "../types/blogs-output.type";

export const blogToOutputMapper = (blog: WithId<BlogDBModel>): BlogOutputModel => {
  const { description, name, websiteUrl, createdAt, isMembership } = blog;
  return {
    id: blog._id.toString(),
    description,
    name,
    websiteUrl,
    createdAt,
    isMembership,
  };
};

export const blogsToOutputMapper = (dbData: WithId<BlogDBModel>[]) => {
  return dbData.map(blogToOutputMapper);
};
