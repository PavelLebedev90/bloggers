import { blogsCollection } from "../../../db/collections";
import { BlogDBModel } from "../types/blogs-db.type";
import { Filter, ObjectId, WithId } from "mongodb";
import { BlogQueryInputModel } from "../types/blogs-query-input.type";
import { PostQueryInputModel } from "../../posts/types/posts-query-input.type";
import { postsQueryRepository } from "../../posts/repository/posts-query.repository";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import { PostDBModel } from "../../posts/types/posts-db.type";
import {
  failResult,
  isError,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";

export const blogsQueryRepository = {
  async getAll(
    query: BlogQueryInputModel,
  ): Promise<Result<{ items: WithId<BlogDBModel>[]; totalCount: number }>> {
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

    return okResult({ data: { items, totalCount }, status: ResultSuccessStatus.Ok });
  },
  async getBlog(blogId: string): Promise<Result<WithId<BlogDBModel>>> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.Unauthorized("blog id", blogId)],
      });
    }
    return okResult({ data: blog, status: ResultSuccessStatus.Ok });
  },
  async getAllPostsByBlogId(
    query: Required<PostQueryInputModel>,
  ): Promise<Result<{ items: WithId<PostDBModel>[]; totalCount: number }>> {
    const result = await this.getBlog(query.blogId);
    if (isError(result)) {
      return result;
    }
    return await postsQueryRepository.getAll(query);
  },
};
