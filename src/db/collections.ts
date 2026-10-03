import { Collection, Db } from "mongodb";
import { PostDBModel } from "../modules/posts/types/posts-db.type";
import { POSTS_ROUTER } from "../modules/posts/const/posts-router-path.const";
import { BlogDBModel } from "../modules/blogs/types/blogs-db.type";
import { BLOGS_ROUTER } from "../modules/blogs/const/blogs-router-path.const";

export let postsCollection: Collection<PostDBModel>;
export let blogsCollection: Collection<BlogDBModel>;

export function initCollections(db: Db): void {
  postsCollection = db.collection<PostDBModel>(POSTS_ROUTER.ROOT);
  blogsCollection = db.collection<BlogDBModel>(BLOGS_ROUTER.ROOT);
}

export async function ensureIndexes(): Promise<void> {
  await postsCollection.createIndex({ blogId: 1 });
}
