import { Filter, ObjectId, WithId } from "mongodb";
import { commentsCollection } from "../../../db/collections";
import { CommentQueryInputModel } from "../types/comments-query-input.type";
import { CommentDBModel } from "../types/comments-db.type";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";

export const commentsQueryRepository = {
  async getAll(
    query: CommentQueryInputModel,
  ): Promise<Result<{ items: WithId<CommentDBModel>[]; totalCount: number }>> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const filter: Filter<CommentDBModel> = {};
    if (query.postId) {
      filter.postId = query.postId;
    }
    const [items, totalCount] = await Promise.all([
      commentsCollection
        .find(filter)
        .sort(query.sortBy, query.sortDirection)
        .skip(skip)
        .limit(query.pageSize)
        .toArray(),
      commentsCollection.countDocuments(filter),
    ]);

    return okResult({ status: ResultSuccessStatus.Ok, data: { items, totalCount } });
  },
  async getComment(commentId: string): Promise<Result<WithId<CommentDBModel>>> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) });
    if (!comment) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("comment id", commentId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: comment,
    });
  },
};
