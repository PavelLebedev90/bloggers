import { BlogDBModel } from "../routers/blogs/types/blogs-db.type";
import { PostDBModel } from "../routers/posts/types/posts-db.type";

export const db = {
  posts: <PostDBModel[]>[],
  blogs: <BlogDBModel[]>[],
};
