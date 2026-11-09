import { Response } from "express";
import { PostOutputModel } from "../types/posts-output.type";
import { postsQueryRepository } from "../repository/posts-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const getPostHandler = async (
  req: SanitizedRequest<unknown, unknown, { id: string }>,
  res: Response<PostOutputModel>,
) => {
  const result = await postsQueryRepository.getPost(req.validData.params.id);
  sendResult({ res, result });
};
