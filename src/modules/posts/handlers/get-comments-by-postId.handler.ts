import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { commentsQueryRepository } from "../../comments/repository/comments-query.repository";
import {
  CommentOutputModel,
  CommentOutputModelWithMeta,
} from "../../comments/types/comments-output.type";
import { CommentQueryInputModel } from "../../comments/types/comments-query-input.type";
import { postsQueryRepository } from "../repository/posts-query.repository";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const getCommentsByPostIdHandler = async (
  req: SanitizedRequest<unknown, CommentQueryInputModel, { postId: string }>,
  res: Response<CommentOutputModelWithMeta>,
) => {
  const postResult = await postsQueryRepository.getPost(req.validData.params.postId);

  if (isError(postResult)) {
    return sendError({
      res,
      httpStatus: HttpStatus[postResult.status],
      errors: postResult.extensions,
    });
  }

  const result = await commentsQueryRepository.getAll({
    ...req.validData.query,
    postId: req.validData.params.postId,
  });

  sendResult({
    res,
    result,
    mapper: (data: { items: CommentOutputModel[]; totalCount: number }) => ({
      items: data.items,
      page: req.validData.query.pageNumber,
      pageSize: req.validData.query.pageSize,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / req.validData.query.pageSize),
    }),
  });
};
