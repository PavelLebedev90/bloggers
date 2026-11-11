import { Response } from "express";
import { inject, injectable } from "inversify";
import { SanitizedRequest } from "../../../core/types/express.type";
import { BlogQueryInputModel } from "../types/blogs-query-input.type";
import { BlogOutputModel, BlogOutputModelWithMeta } from "../types/blogs-output.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { BlogsService } from "../service/blogs.service";
import { BlogsQueryRepository } from "../repository/blogs-query.repository";
import { PostQueryInputModel } from "../../posts/types/posts-query-input.type";
import { PostOutputModel, PostOutputModelWithMeta } from "../../posts/types/posts-output.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { BlogInputModel } from "../types/blogs-input.type";
import { PostInputModel } from "../../posts/types/posts-input.type";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { PostsQueryRepository } from "../../posts/repository/posts-query.repository";
import { PostsService } from "../../posts/service/posts.service";

@injectable()
export class BlogsController {
  constructor(
    //TODO
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @inject(BlogsService)
    private blogsService: BlogsService,
    @inject(PostsService)
    private postsService: PostsService,
  ) {}

  async getAllBlogs(
    req: SanitizedRequest<unknown, BlogQueryInputModel>,
    res: Response<BlogOutputModelWithMeta | ValidationErrorMessages>,
  ) {
    const result = await this.blogsQueryRepository.getAll(req.validData.query);
    sendResult({
      res,
      result,
      mapper: (data: { items: BlogOutputModel[]; totalCount: number }) => ({
        items: data.items,
        page: req.validData.query.pageNumber,
        pageSize: req.validData.query.pageSize,
        totalCount: data.totalCount,
        pagesCount: Math.ceil(data.totalCount / req.validData.query.pageSize),
      }),
    });
  }
  async getBlog(
    req: SanitizedRequest<unknown, unknown, { id: string }>,
    res: Response<BlogOutputModel | ValidationErrorMessages>,
  ) {
    const result = await this.blogsQueryRepository.getBlog(req.validData.params.id);
    sendResult({ res, result });
  }
  async getPostsByBlogId(
    req: SanitizedRequest<unknown, PostQueryInputModel, { blogId: string }>,
    res: Response<PostOutputModelWithMeta | ValidationErrorMessages>,
  ) {
    const result = await this.blogsQueryRepository.getAllPostsByBlogId({
      ...req.validData.query,
      blogId: req.validData.params.blogId,
    });
    sendResult({
      res,
      result,
      mapper: (data: { items: PostOutputModel[]; totalCount: number }) => ({
        items: data.items,
        page: req.validData.query.pageNumber,
        pageSize: req.validData.query.pageSize,
        totalCount: data.totalCount,
        pagesCount: Math.ceil(data.totalCount / req.validData.query.pageSize),
      }),
    });
  }
  async createBlog(
    req: SanitizedRequest<BlogInputModel>,
    res: Response<BlogOutputModel | ValidationErrorMessages>,
  ) {
    const bodyBlog = blogToDBMapper(req.validData.body);
    const resultWithBlogId = await this.blogsService.createBlog({
      ...bodyBlog,
      createdAt: new Date(),
      isMembership: false,
    });
    const result = await this.blogsQueryRepository.getBlog(resultWithBlogId.data);
    sendResult({
      res,
      result,
      overwriteSuccessStatus: resultWithBlogId.status,
    });
  }
  async createPostByBlogId(
    req: SanitizedRequest<Omit<PostInputModel, "blogId">, unknown, { blogId: string }>,
    res: Response<PostOutputModel | ValidationErrorMessages>,
  ) {
    const resultWithPostId = await this.postsService.createPost({
      ...req.validData.body,
      blogId: req.validData.params.blogId,
    });
    if (isError(resultWithPostId)) {
      return sendError({
        res,
        httpStatus: HttpStatus[resultWithPostId.status],
        errors: resultWithPostId.extensions,
      });
    }
    const result = await this.postsQueryRepository.getPost(resultWithPostId.data);
    sendResult({ res, result, overwriteSuccessStatus: resultWithPostId.status });
  }
  async updateBlog(
    req: SanitizedRequest<BlogInputModel, unknown, { id: string }>,
    res: Response<undefined | ValidationErrorMessages>,
  ) {
    const bodyBlog = blogToDBMapper(req.validData.body);
    const result = await this.blogsService.updateBlog(req.validData.params.id, bodyBlog);
    sendResult({ res, result });
  }
  async deleteBlog(
    req: SanitizedRequest<unknown, unknown, { id: string }>,
    res: Response<undefined | ValidationErrorMessages>,
  ) {
    const result = await this.blogsService.deleteBlog(req.validData.params.id);
    sendResult({
      res,
      result,
    });
  }
}
