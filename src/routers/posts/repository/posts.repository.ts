import { postsCollection } from "../../../db/collections";
import { WithId } from "mongodb";
import { PostDBModel } from "../types/posts-db.type";

export const postsRepository = {
  async getAll() {
    return await postsCollection.find({}).toArray();
  },
  async getPost(postId: string) {
    return await postsCollection.findOne({ id: postId });
  },
  async createPost(bodyPost: PostDBModel): Promise<WithId<PostDBModel>> {
    const newPost = await postsCollection.insertOne(bodyPost);
    return { ...bodyPost, _id: newPost.insertedId };
  },
  async updatePost(postId: string, bodyPost: Omit<PostDBModel, "createdAt">) {
    const result = await postsCollection.updateOne({ id: postId }, { $set: bodyPost });
    return result.matchedCount === 1;
  },
  async deletePost(postId: string) {
    const result = await postsCollection.deleteOne({ id: postId });
    return result.deletedCount === 1;
  },
};
