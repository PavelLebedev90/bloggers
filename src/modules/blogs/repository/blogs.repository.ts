import { blogsCollection } from "../../../db/collections";
import { BlogDBModel } from "../types/blogs-db.type";
import { InsertOneResult, ObjectId } from "mongodb";

export const blogsRepository = {
  async getBlog(blogId: string) {
    return await blogsCollection.findOne({ _id: new ObjectId(blogId) });
  },
  async createBlog(bodyBlog: BlogDBModel): Promise<InsertOneResult<BlogDBModel>> {
    return await blogsCollection.insertOne(bodyBlog);
  },
  async updateBlog(blogId: string, bodyBlog: Omit<BlogDBModel, "createdAt" | "isMembership">) {
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(blogId) },
      { $set: bodyBlog },
    );
    return result.matchedCount === 1;
  },
  async deleteBlog(blogId: string) {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
    return result.deletedCount === 1;
  },
};
