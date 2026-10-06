import { Collection, Db } from "mongodb";
import { PostDBModel } from "../modules/posts/types/posts-db.type";
import { POSTS_ROUTER } from "../modules/posts/const/posts-router-path.const";
import { BlogDBModel } from "../modules/blogs/types/blogs-db.type";
import { BLOGS_ROUTER } from "../modules/blogs/const/blogs-router-path.const";
import { UserDBModel } from "../modules/users/types/users-db.type";
import { USERS_ROUTER } from "../modules/users/const/users-router-path.const";

export let postsCollection: Collection<PostDBModel>;
export let blogsCollection: Collection<BlogDBModel>;
export let usersCollection: Collection<UserDBModel>;

export function initCollections(db: Db): void {
  postsCollection = db.collection<PostDBModel>(POSTS_ROUTER.ROOT);
  blogsCollection = db.collection<BlogDBModel>(BLOGS_ROUTER.ROOT);
  usersCollection = db.collection<UserDBModel>(USERS_ROUTER.ROOT);
}

export async function ensureIndexes(): Promise<void> {
  await postsCollection.createIndex({ blogId: 1 });
  await usersCollection.createIndexes([
    { key: { email: 1 }, name: "email_unique", unique: true },
    { key: { login: 1 }, name: "login_unique", unique: true },
  ]);
}
