import { postsCollection } from "../../../db/collections";
import { InsertOneResult, ObjectId } from "mongodb";
import { PostDBModel } from "../types/posts-db.type";

export const postsRepository = {
  async createPost(bodyPost: PostDBModel): Promise<InsertOneResult<PostDBModel>> {
    return await postsCollection.insertOne(bodyPost);
  },
  async updatePost(postId: string, bodyPost: Omit<PostDBModel, "createdAt">) {
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: bodyPost },
    );
    return result.matchedCount === 1;
  },
  async deletePost(postId: string) {
    const result = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
    return result.deletedCount === 1;
  },
};
