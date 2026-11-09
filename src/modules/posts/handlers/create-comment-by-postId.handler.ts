import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { CommentInputModel } from "../../comments/types/comments-input.type";
import { usersQueryRepository } from "../../users/repository/users-query.repository";
import { commentToDBMapper } from "../../comments/mappers/comment-to-db.mapper";
import { CommentOutputModel } from "../../comments/types/comments-output.type";
import { commentsService } from "../../comments/service/comments.service";
import { commentsQueryRepository } from "../../comments/repository/comments-query.repository";
import { postsQueryRepository } from "../repository/posts-query.repository";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const createCommentByPostIdHandler = async (
  req: SanitizedRequest<CommentInputModel, unknown, { postId: string }, unknown, JWTUserInfo>,
  res: Response<CommentOutputModel | ValidationErrorMessages>,
) => {
  const userResult = await usersQueryRepository.getUser(req.userSession.userId);
  if (isError(userResult)) {
    return sendError({
      res,
      httpStatus: HttpStatus[userResult.status],
      errors: userResult.extensions,
    });
  }
  const postResult = await postsQueryRepository.getPost(req.validData.params.postId);
  if (isError(postResult)) {
    return sendError({
      res,
      httpStatus: HttpStatus[postResult.status],
      errors: postResult.extensions,
    });
  }
  const dbComment = commentToDBMapper(req.validData.body, userResult.data);
  const resultWithCommentId = await commentsService.createComment({
    ...dbComment,
    createdAt: new Date(),
    postId: req.validData.params.postId,
  });

  const result = await commentsQueryRepository.getComment(resultWithCommentId.data);
  sendResult({ res, result, overwriteSuccessStatus: resultWithCommentId.status });
};
