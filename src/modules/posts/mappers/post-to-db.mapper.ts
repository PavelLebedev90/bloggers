import { WithId } from "mongodb";
import { BlogDBModel } from "../../blogs/types/blogs-db.type";
import { PostDBModel } from "../types/posts-db.type";
import { PostInputModel } from "../types/posts-input.type";

export const postToDBMapper = (
  post: PostInputModel,
  blog: WithId<BlogDBModel>,
): Omit<PostDBModel, "createdAt"> => {
  return {
    blogId: blog._id.toString(),
    blogName: blog.name,
    content: post.content,
    shortDescription: post.shortDescription,
    title: post.title,
  };
};
