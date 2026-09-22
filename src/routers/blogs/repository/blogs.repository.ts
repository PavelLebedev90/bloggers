import { nanoid } from "nanoid";
import { BlogCreateModel, BlogUpdateModel } from "../types/blogs-input.type";
import { blogsToOutputMapper, blogToOutputMapper } from "../mappers/blog-to-output.mapper";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { blogsCollection } from "../../../db/collections";

export const blogsRepository = {
  async getAll() {
    const blogs = await blogsCollection.find({}).toArray();
    return blogsToOutputMapper(blogs);
  },
  async getBlog(blogId: string) {
    const blog = await blogsCollection.findOne({ id: blogId });
    if (blog) {
      return blogToOutputMapper(blog);
    }
    return blog;
  },
  async createBlog(bodyBlog: BlogCreateModel) {
    const id = nanoid(10);

    const newBlog = blogToDBMapper(id, bodyBlog);

    await blogsCollection.insertOne(newBlog);

    return blogToOutputMapper(newBlog);
  },
  async updateBlog(blogId: string, bodyBlog: BlogUpdateModel) {
    const result = await blogsCollection.updateOne({ id: blogId }, { $set: bodyBlog });
    return result.matchedCount === 1;
  },
  async deleteBlog(blogId: string) {
    const result = await blogsCollection.deleteOne({ id: blogId });
    return result.deletedCount === 1;
  },
};
