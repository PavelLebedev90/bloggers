import { BlogDBModel } from "../../blogs/types/blogs-db.type";
import { PostDBModel } from "../types/posts-db.type";
import { PostCreateModel } from "../types/posts-input.type";

export const postToDBMapper = (
  newPostId: string,
  post: PostCreateModel,
  blog: BlogDBModel,
): PostDBModel => {
  return {
    id: newPostId,
    blogId: blog.id,
    blogName: blog.name,
    content: post.content,
    shortDescription: post.shortDescription,
    title: post.title,
  };
};
