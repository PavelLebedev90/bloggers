import { blogsCollection } from "../../../db/collections";
import { BlogDBModel } from "../types/blogs-db.type";
import { Filter, InsertOneResult, ObjectId } from "mongodb";
import { BlogQueryInputModel } from "../types/blogs-query-input.type";

export const blogsRepository = {
  async getAll(query: BlogQueryInputModel) {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const filter: Filter<BlogDBModel> = {};
    if (query.searchNameTerm) {
      filter.name = { $regex: query.searchNameTerm, $options: "i" };
    }
    const [items, totalCount] = await Promise.all([
      blogsCollection
        .find(filter)
        .sort(query.sortBy, query.sortDirection)
        .skip(skip)
        .limit(query.pageSize)
        .toArray(),
      blogsCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },
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
