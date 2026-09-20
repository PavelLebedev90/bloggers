import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { BlogResponseModel } from "../types/blogs-output.type";
import { blogsRepository } from "../repository/blogs.repository";

export const getAllBlogsHandler = (_req: Request, res: Response<BlogResponseModel[]>) => {
  const outputData = blogsRepository.getAll();
  res.status(HttpStatus.Ok).send(outputData);
};
