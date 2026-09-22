import { nanoid } from "nanoid";
import { BlogDBModel } from "../../blogs/types/blogs-db.type";
import { PostCreateModel, PostUpdateModel } from "../types/posts-input.type";
import { postsToOutputMapper, postToOutputMapper } from "../mappers/post-to-output.mapper";
import { postToDBMapper } from "../mappers/post-to-db.mapper";
import { postsCollection } from "../../../db/collections";

export const postsRepository = {
  async getAll() {
    const result = await postsCollection.find({}).toArray();
    return postsToOutputMapper(result);
  },
  async getPost(postId: string) {
    const result = await postsCollection.findOne({ id: postId });

    if (result) {
      return postToOutputMapper(result);
    }
    return result;
  },
  async createPost(bodyPost: PostCreateModel, blog: BlogDBModel) {
    const id = nanoid(10);

    const newPost = postToDBMapper(id, bodyPost, blog);
    await postsCollection.insertOne(newPost);

    return postToOutputMapper(newPost);
  },
  async updatePost(postId: string, bodyPost: PostUpdateModel) {
    const result = await postsCollection.updateOne({ id: postId }, { $set: bodyPost });
    return result.matchedCount === 1;
  },
  async deletePost(postId: string) {
    const result = await postsCollection.deleteOne({ id: postId });
    return result.deletedCount === 1;
  },
};
