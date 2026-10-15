import { postsCollection } from "../../../db/collections";
import { Filter, ObjectId, WithId } from "mongodb";
import { PostDBModel } from "../types/posts-db.type";
import { PostQueryInputModel } from "../types/posts-query-input.type";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";

export const postsQueryRepository = {
  async getAll(
    query: PostQueryInputModel,
  ): Promise<Result<{ items: WithId<PostDBModel>[]; totalCount: number }>> {
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

    return okResult({ status: ResultSuccessStatus.Ok, data: { items, totalCount } });
  },
  async getPost(postId: string): Promise<Result<WithId<PostDBModel>>> {
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("post id", postId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: post,
    });
  },
};
