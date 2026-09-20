import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../consts/error-messages.const";
import { blogsRepository } from "../repository/blogs.repository";

export const deleteBlogHandler = (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = blogsRepository.deleteBlog(req.params.id);
  if (!isDeleted) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("id", "blog")],
    });
  }

  res.sendStatus(HttpStatus.NoContent);
};
