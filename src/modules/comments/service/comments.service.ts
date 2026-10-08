import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { commentsRepository } from "../repository/comments.repository";
import { CommentInputModel } from "../types/comments-input.type";
import { CommentDBModel } from "../types/comments-db.type";

export const commentsService = {
  async createComment(bodyComment: CommentDBModel) {
    const { insertedId } = await commentsRepository.createComment(bodyComment);
    return insertedId.toString();
  },
  async updateComment(commentId: string, bodyComment: CommentInputModel) {
    const isUpdated = await commentsRepository.updateComment(commentId, bodyComment);
    if (!isUpdated) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("comment id", commentId));
    }

    return isUpdated;
  },
  async deleteComment(commentId: string) {
    const isDeleted = await commentsRepository.deleteComment(commentId);
    if (!isDeleted) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("comment id", commentId));
    }
    return isDeleted;
  },
};
