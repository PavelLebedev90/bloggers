import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { BlogResponseModel } from "../types/blogs-output.type";
import { blogsRepository } from "../repository/blogs.repository";

export const getAllBlogsHandler = async (_req: Request, res: Response<BlogResponseModel[]>) => {
  const outputData = await blogsRepository.getAll();
  res.status(HttpStatus.Ok).send(outputData);
};
