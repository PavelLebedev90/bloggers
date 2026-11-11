import { Response } from "express";
import { inject, injectable } from "inversify";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";
import { PostQueryInputModel } from "../types/posts-query-input.type";
import { PostOutputModel, PostOutputModelWithMeta } from "../types/posts-output.type";
import { PostsQueryRepository } from "../repository/posts-query.repository";
import { CommentOutputModel } from "../../comments/types/comments-output.type";
import { CommentOutputModelWithMeta } from "../../comments/types/comments-output.type";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { CommentQueryInputModel } from "../../comments/types/comments-query-input.type";
import { CommentsQueryRepository } from "../../comments/repository/comments-query.repository";
import { CommentInputModel } from "../../comments/types/comments-input.type";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { commentToDBMapper } from "../../comments/mappers/comment-to-db.mapper";
import { CommentsService } from "../../comments/service/comments.service";
import { UsersService } from "../../users/service/users.service";
import { PostsService } from "../service/posts.service";
import { userToOutputMapper } from "../../users/mappers/user-to-output.mapper";
import { PostInputModel } from "../types/posts-input.type";

@injectable()
export class PostsController {
  constructor(
    //TODO
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @inject(PostsService)
    private postsService: PostsService,
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
    @inject(UsersService)
    private usersService: UsersService,
    @inject(CommentsService)
    private commentsService: CommentsService,
  ) {}
  async getAllPosts(
    req: SanitizedRequest<unknown, PostQueryInputModel>,
    res: Response<PostOutputModelWithMeta>,
  ) {
    const result = await this.postsQueryRepository.getAll(req.validData.query);
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
  async getPost(
    req: SanitizedRequest<unknown, unknown, { id: string }>,
    res: Response<PostOutputModel>,
  ) {
    const result = await this.postsQueryRepository.getPost(req.validData.params.id);
    sendResult({ res, result });
  }
  async createPost(
    req: SanitizedRequest<PostInputModel>,
    res: Response<PostOutputModel | ValidationErrorMessages>,
  ) {
    const resultWithPostId = await this.postsService.createPost(req.validData.body);
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
  async getCommentsByPostId(
    req: SanitizedRequest<unknown, CommentQueryInputModel, { postId: string }>,
    res: Response<CommentOutputModelWithMeta>,
  ) {
    const postResult = await this.postsService.getPost(req.validData.params.postId);

    if (isError(postResult)) {
      return sendError({
        res,
        httpStatus: HttpStatus[postResult.status],
        errors: postResult.extensions,
      });
    }

    const result = await this.commentsQueryRepository.getAll({
      ...req.validData.query,
      postId: req.validData.params.postId,
    });

    sendResult({
      res,
      result,
      mapper: (data: { items: CommentOutputModel[]; totalCount: number }) => ({
        items: data.items,
        page: req.validData.query.pageNumber,
        pageSize: req.validData.query.pageSize,
        totalCount: data.totalCount,
        pagesCount: Math.ceil(data.totalCount / req.validData.query.pageSize),
      }),
    });
  }
  async createCommentByPostId(
    req: SanitizedRequest<CommentInputModel, unknown, { postId: string }, unknown, JWTUserInfo>,
    res: Response<CommentOutputModel | ValidationErrorMessages>,
  ) {
    const userResult = await this.usersService.getUser(req.userSession.userId);
    if (isError(userResult)) {
      return sendError({
        res,
        httpStatus: HttpStatus[userResult.status],
        errors: userResult.extensions,
      });
    }
    const postResult = await this.postsService.getPost(req.validData.params.postId);
    if (isError(postResult)) {
      return sendError({
        res,
        httpStatus: HttpStatus[postResult.status],
        errors: postResult.extensions,
      });
    }
    const user = userToOutputMapper(userResult.data);
    const dbComment = commentToDBMapper(req.validData.body, user);
    const resultWithCommentId = await this.commentsService.createComment({
      ...dbComment,
      createdAt: new Date(),
      postId: req.validData.params.postId,
    });

    const result = await this.commentsQueryRepository.getComment(resultWithCommentId.data);
    sendResult({ res, result, overwriteSuccessStatus: resultWithCommentId.status });
  }
  async updatePost(
    req: SanitizedRequest<PostInputModel, unknown, { id: string }>,
    res: Response<PostOutputModel | ValidationErrorMessages>,
  ) {
    const result = await this.postsService.updatePost(req.validData.params.id, req.validData.body);
    sendResult({ res, result });
  }
  async deletePost(
    req: SanitizedRequest<unknown, unknown, { id: string }>,
    res: Response<undefined | ValidationErrorMessages>,
  ) {
    const result = await this.postsService.deletePost(req.validData.params.id);
    sendResult({ res, result });
  }
}
