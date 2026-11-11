import { Response } from "express";
import { inject, injectable } from "inversify";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";
import { CommentsQueryRepository } from "../repository/comments-query.repository";
import { CommentsService } from "../service/comments.service";
import { CommentOutputModel } from "../types/comments-output.type";
import { CommentInputModel } from "../types/comments-input.type";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
    @inject(CommentsService)
    private commentsService: CommentsService,
  ) {}
  async getComment(
    req: SanitizedRequest<unknown, unknown, { commentId: string }>,
    res: Response<CommentOutputModel | ValidationErrorMessages>,
  ) {
    const result = await this.commentsQueryRepository.getComment(req.validData.params.commentId);
    sendResult({ res, result });
  }
  async updateComment(
    req: SanitizedRequest<CommentInputModel, unknown, { commentId: string }, unknown, JWTUserInfo>,
    res: Response<undefined | ValidationErrorMessages>,
  ) {
    const result = await this.commentsService.updateComment(
      req.userSession.userId,
      req.validData.params.commentId,
      req.validData.body,
    );
    sendResult({ res, result });
  }
  async deleteComment(
    req: SanitizedRequest<unknown, unknown, { commentId: string }, unknown, JWTUserInfo>,
    res: Response<undefined | ValidationErrorMessages>,
  ) {
    const result = await this.commentsService.deleteComment(
      req.userSession.userId,
      req.validData.params.commentId,
    );
    sendResult({ res, result });
  }
}
