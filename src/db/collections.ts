import { Collection, Db } from "mongodb";
import { PostDBModel } from "../routers/posts/types/posts-db.type";
import { BlogDBModel } from "../routers/blogs/types/blogs-db.type";
import { BLOGS_ROUTER } from "../routers/blogs/const/blogs-router-path.const";
import { POSTS_ROUTER } from "../routers/posts/const/posts-router-path.const";

export let postsCollection: Collection<PostDBModel>;
export let blogsCollection: Collection<BlogDBModel>;

export function initCollections(db: Db): void {
  postsCollection = db.collection<PostDBModel>(POSTS_ROUTER.ROOT);
  blogsCollection = db.collection<BlogDBModel>(BLOGS_ROUTER.ROOT);
}
