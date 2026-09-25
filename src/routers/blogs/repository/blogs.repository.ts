import { blogsCollection } from "../../../db/collections";
import { BlogDBModel } from "../types/blogs-db.type";
import { ObjectId, WithId } from "mongodb";

export const blogsRepository = {
  async getAll() {
    const blogs = await blogsCollection.find({}).toArray();
    return blogs;
  },
  async getBlog(blogId: string) {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
    if (blog) {
      return blog;
    }
    return blog;
  },
  async createBlog(bodyBlog: BlogDBModel): Promise<WithId<BlogDBModel>> {
    const blog = await blogsCollection.insertOne(bodyBlog);
    return { ...bodyBlog, _id: blog.insertedId };
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
