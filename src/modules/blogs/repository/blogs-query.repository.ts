import { blogsCollection } from "../../../db/collections";
import { BlogDBModel } from "../types/blogs-db.type";
import { Filter, ObjectId } from "mongodb";
import { BlogQueryInputModel } from "../types/blogs-query-input.type";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { PostQueryInputModel } from "../../posts/types/posts-query-input.type";
import { postsQueryRepository } from "../../posts/repository/posts-query.repository";

export const blogsQueryRepository = {
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
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("blog id", blogId));
    }
    return blog;
  },
  async getAllPostsByBlogId(query: Required<PostQueryInputModel>) {
    await this.getBlog(query.blogId);
    return await postsQueryRepository.getAll(query);
  },
};
