import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { commentsQueryRepository } from "../../comments/repository/comments-query.repository";
import { commentsToOutputMapper } from "../../comments/mappers/comment-to-output.mapper";
import { CommentOutputModelWithMeta } from "../../comments/types/comments-output.type";
import { CommentQueryInputModel } from "../../comments/types/comments-query-input.type";

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
  const { items, totalCount } = await commentsQueryRepository.getAll({
    ...res.locals.query,
    postId: res.locals.params.postId,
  });
  res.status(HttpStatus.Ok).send({
    items: commentsToOutputMapper(items),
    page: res.locals.query.pageNumber,
    pageSize: res.locals.query.pageSize,
    totalCount: totalCount,
    pagesCount: Math.ceil(totalCount / res.locals.query.pageSize),
  });
};
