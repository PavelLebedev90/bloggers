import { Filter, ObjectId } from "mongodb";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { commentsCollection } from "../../../db/collections";
import { CommentQueryInputModel } from "../types/comments-query-input.type";
import { CommentDBModel } from "../types/comments-db.type";

export const commentsQueryRepository = {
  async getAll(query: CommentQueryInputModel) {
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

    return { items, totalCount };
  },
  async getComment(commentId: string) {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) });
    if (!comment) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("comment id", commentId));
    }
    return comment;
  },
};
