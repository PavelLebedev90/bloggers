import { WithId } from "mongodb";
import { PostDBModel } from "../types/posts-db.type";
import { PostOutputModel } from "../types/posts-output.type";

export const postToOutputMapper = (post: WithId<PostDBModel>): PostOutputModel => {
  const { _id, blogId, blogName, content, shortDescription, title, createdAt } = post;
  return {
    id: _id.toString(),
    blogId,
    blogName,
    content,
    shortDescription,
    title,
    createdAt,
  };
};

export const postsToOutputMapper = (dbData: WithId<PostDBModel>[]) => {
  return dbData.map(postToOutputMapper);
};
