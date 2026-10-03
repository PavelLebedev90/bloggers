import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { blogsService } from "../service/blogs.service";

export const deleteBlogHandler = async (
  _req: Request,
  res: Response<unknown, { params: { id: string } }>,
) => {
  await blogsService.deleteBlog(res.locals.params.id);
  res.sendStatus(HttpStatus.NoContent);
};
