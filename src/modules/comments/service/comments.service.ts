import { commentsRepository } from "../repository/comments.repository";
import { CommentInputModel } from "../types/comments-input.type";
import { CommentDBModel } from "../types/comments-db.type";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import { WithId } from "mongodb";
import {
  failResult,
  isSuccess,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";

export const commentsService = {
  async getComment(commentId: string): Promise<Result<WithId<CommentDBModel>>> {
    const comments = await commentsRepository.getComment(commentId);
    if (!comments) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.Unauthorized("comments id", commentId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: comments,
    });
  },
  async createComment(bodyComment: CommentDBModel): Promise<Result<string>> {
    const { insertedId } = await commentsRepository.createComment(bodyComment);
    return okResult({
      status: ResultSuccessStatus.Created,
      data: insertedId.toString(),
    });
  },
  async updateComment(
    userId: string,
    commentId: string,
    bodyComment: CommentInputModel,
  ): Promise<Result<true>> {
    const result = await this.getComment(commentId);
    if (isSuccess(result)) {
      if (result.data.userId !== userId) {
        return failResult({
          status: ResultErrorStatus.Forbidden,
          extensions: [ERROR_MESSAGES.Forbidden("comments id", commentId)],
        });
      }
    }

    const isUpdated = await commentsRepository.updateComment(commentId, bodyComment);
    if (!isUpdated) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("comments id", commentId)],
      });
    }

    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isUpdated,
    });
  },
  async deleteComment(userId: string, commentId: string): Promise<Result<true>> {
    const result = await this.getComment(commentId);
    if (isSuccess(result)) {
      if (result.data.userId !== userId) {
        return failResult({
          status: ResultErrorStatus.Forbidden,
          extensions: [ERROR_MESSAGES.Forbidden("comments id", commentId)],
        });
      }
    }

    const isDeleted = await commentsRepository.deleteComment(commentId);
    if (!isDeleted) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("comments id", commentId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isDeleted,
    });
  },
};
