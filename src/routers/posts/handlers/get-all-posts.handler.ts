import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { PostOutputModel } from "../types/posts-output.type";
import { postsRepository } from "../repository/posts.repository";
import { postsToOutputMapper } from "../mappers/post-to-output.mapper";

export const getAllPostsHandler = async (_req: Request, res: Response<PostOutputModel[]>) => {
  const outputData = await postsRepository.getAll();
  res.status(HttpStatus.Ok).send(postsToOutputMapper(outputData));
};
