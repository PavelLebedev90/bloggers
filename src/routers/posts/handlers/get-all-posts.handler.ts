import { Response, Request } from "express";

import { HttpStatus } from "../../../core/types/http-statuses.type";
import { PostResponseModel } from "../types/posts-output.type";
import { postsRepository } from "../repository/posts.repository";

export const getAllPostsHandler = (_req: Request, res: Response<PostResponseModel[]>) => {
  const outputData = postsRepository.getAll();
  res.status(HttpStatus.Ok).send(outputData);
};
