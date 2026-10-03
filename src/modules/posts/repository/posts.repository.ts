import { postsCollection } from "../../../db/collections";
import { Filter, InsertOneResult, ObjectId } from "mongodb";
import { PostDBModel } from "../types/posts-db.type";
import { PostQueryInputModel } from "../types/posts-query-input.type";

export const postsRepository = {
  async getAll(query: PostQueryInputModel) {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const filter: Filter<PostDBModel> = {};
    if (query.blogId) {
      filter.blogId = query.blogId;
    }
    const [items, totalCount] = await Promise.all([
      postsCollection
        .find(filter)
        .sort(query.sortBy, query.sortDirection)
        .skip(skip)
        .limit(query.pageSize)
        .toArray(),
      postsCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },
  async getPost(postId: string) {
    return await postsCollection.findOne({ _id: new ObjectId(postId) });
  },
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
