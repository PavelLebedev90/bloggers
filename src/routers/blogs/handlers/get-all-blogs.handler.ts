import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogsRepository } from "../repository/blogs.repository";
import { blogsToOutputMapper } from "../mappers/blog-to-output.mapper";

export const getAllBlogsHandler = async (_req: Request, res: Response<BlogOutputModel[]>) => {
  const outputData = await blogsRepository.getAll();
  res.status(HttpStatus.Ok).send(blogsToOutputMapper(outputData));
};
