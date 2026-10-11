import { Response, Request } from "express";
import { PostOutputModel } from "../types/posts-output.type";
import { postToOutputMapper } from "../mappers/post-to-output.mapper";
import { postsQueryRepository } from "../repository/posts-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const getPostHandler = async (
  _req: Request,
  res: Response<
    PostOutputModel,
    {
      params: { id: string };
    }
  >,
) => {
  const result = await postsQueryRepository.getPost(res.locals.params.id);
  sendResult(res, result, postToOutputMapper);
};
