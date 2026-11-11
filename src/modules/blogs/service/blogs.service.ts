import { BlogDBModel } from "../types/blogs-db.type";
import { BlogsRepository } from "../repository/blogs.repository";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import { WithId } from "mongodb";
import {
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
  SuccessResult,
} from "../../../core/types/result.type";
import { inject, injectable } from "inversify";
@injectable()
export class BlogsService {
  constructor(
    //TODO
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
  ) {}

  async getBlog(blogId: string): Promise<Result<WithId<BlogDBModel>>> {
    const blog = await this.blogsRepository.getBlog(blogId);

    if (!blog) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("blog id", blogId)],
      });
    }
    return okResult({ status: ResultSuccessStatus.Ok, data: blog });
  }
  async createBlog(bodyBlog: BlogDBModel): Promise<SuccessResult<string>> {
    const { insertedId } = await this.blogsRepository.createBlog(bodyBlog);
    return okResult({
      status: ResultSuccessStatus.Created,
      data: insertedId.toString(),
    });
  }
  async updateBlog(
    blogId: string,
    bodyBlog: Omit<BlogDBModel, "createdAt" | "isMembership">,
  ): Promise<Result<true>> {
    const isUpdated = await this.blogsRepository.updateBlog(blogId, bodyBlog);
    if (!isUpdated) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("blog id", blogId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isUpdated,
    });
  }
  async deleteBlog(blogId: string): Promise<Result<true>> {
    const isDeleted = await this.blogsRepository.deleteBlog(blogId);
    if (!isDeleted) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("blog id", blogId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isDeleted,
    });
  }
}
