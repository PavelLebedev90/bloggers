import { Response, Request } from "express";
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

export const getCommentsByPostIdHandler = async (
  _req: Request,
  res: Response<
    CommentOutputModelWithMeta,
    {
      params: { postId: string };
      userId: string;
      query: CommentQueryInputModel;
    }
  >,
) => {
  const postResult = await postsQueryRepository.getPost(res.locals.params.postId);

  if (isError(postResult)) {
    return sendError({
      res,
      httpStatus: HttpStatus[postResult.status],
      errors: postResult.extensions,
    });
  }

  const result = await commentsQueryRepository.getAll({
    ...res.locals.query,
    postId: res.locals.params.postId,
  });

  sendResult({
    res,
    result,
    mapper: (data: { items: CommentOutputModel[]; totalCount: number }) => ({
      items: data.items,
      page: res.locals.query.pageNumber,
      pageSize: res.locals.query.pageSize,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / res.locals.query.pageSize),
    }),
  });
};
