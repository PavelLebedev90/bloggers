import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { commentsRepository } from "../repository/comments.repository";
import { CommentInputModel } from "../types/comments-input.type";
import { CommentDBModel } from "../types/comments-db.type";

export const commentsService = {
  async getComment(commentId: string) {
    const comments = await commentsRepository.getComment(commentId);
    if (!comments) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("comments id", commentId));
    }
    return comments;
  },
  async createComment(bodyComment: CommentDBModel) {
    const { insertedId } = await commentsRepository.createComment(bodyComment);
    return insertedId.toString();
  },
  async updateComment(userId: string, commentId: string, bodyComment: CommentInputModel) {
    const comment = await this.getComment(commentId);
    if (comment.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.forbidden("comment id", commentId));
    }
    const isUpdated = await commentsRepository.updateComment(commentId, bodyComment);
    if (!isUpdated) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("comment id", commentId));
    }

    return isUpdated;
  },
  async deleteComment(userId: string, commentId: string) {
    const comment = await this.getComment(commentId);
    if (comment.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.forbidden("comment id", commentId));
    }
    const isDeleted = await commentsRepository.deleteComment(commentId);
    if (!isDeleted) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("comment id", commentId));
    }
    return isDeleted;
  },
};
