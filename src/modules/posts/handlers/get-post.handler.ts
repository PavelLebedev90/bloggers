import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { PostOutputModel } from "../types/posts-output.type";
import { postToOutputMapper } from "../mappers/post-to-output.mapper";
import { postsQueryRepository } from "../repository/posts-query.repository";

export const getPostHandler = async (
  _req: Request,
  res: Response<
    PostOutputModel,
    {
      params: { id: string };
    }
  >,
) => {
  const dbPost = await postsQueryRepository.getPost(res.locals.params.id);
  res.status(HttpStatus.Ok).send(postToOutputMapper(dbPost));
};
