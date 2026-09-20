import { PostDBModel } from "../types/posts-db.type";
import { PostResponseModel } from "../types/posts-output.type";

export const postToOutputMapper = (post: PostDBModel): PostResponseModel => {
  const { id, blogId, blogName, content, shortDescription, title } = post;
  return {
    id,
    blogId,
    blogName,
    content,
    shortDescription,
    title,
  };
};

export const postsToOutputMapper = (dbData: PostDBModel[]) => {
  return dbData.map(postToOutputMapper);
};
