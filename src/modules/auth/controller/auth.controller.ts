import { Response } from "express";
import { UsersQueryRepository } from "../../users/repository/users-query.repository";
import { AuthService } from "../service/auth.service";
import { JWTType, JWTUserInfo } from "../../../core/adapters/jwt.adapter";
import { SanitizedRequest, SessionRequest } from "../../../core/types/express.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { AuthOutputModel } from "../types/auth-output.type";
import { authTokenToOutputMapper, authToOutputMapper } from "../mappers/auth-to-output.mapper";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { AuthInputModel } from "../types/auth-input.type";
import { collectMetaRequest } from "../../../core/helpers/collect-meta-request.helper";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { clearRefreshCookie, setRefreshCookie } from "../../../core/helpers/refresh-cookie.helper";
import { UserInputModel } from "../../users/types/users-input.type";
import { ResultSuccessStatus } from "../../../core/types/result.type";
import { UserOutputModel } from "../../users/types/users-output.type";
import { inject, injectable } from "inversify";

@injectable()
export class AuthController {
  constructor(
    @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
    @inject(AuthService) private authService: AuthService,
  ) {}
  async getMe(
    req: SessionRequest<JWTUserInfo>,
    res: Response<AuthOutputModel | ValidationErrorMessages>,
  ) {
    const user = await this.usersQueryRepository.getUser(req.userSession.userId);
    sendResult({ res, result: user, mapper: authToOutputMapper });
  }
  async login(
    req: SanitizedRequest<AuthInputModel>,
    res: Response<{ accessToken: string } | ValidationErrorMessages>,
  ) {
    const meta = collectMetaRequest(req);
    const result = await this.authService.login(req.validData.body, meta);
    if (isError(result))
      return sendError({ res, httpStatus: HttpStatus[result.status], errors: result.extensions });
    setRefreshCookie(req, res, result.data.refreshToken.token, result.data.refreshToken.exp);
    sendResult({ res, result, mapper: authTokenToOutputMapper });
  }
  async logout(
    req: SessionRequest<JWTUserInfo<JWTType.REFRESH>>,
    res: Response<undefined | ValidationErrorMessages>,
  ) {
    const result = await this.authService.logout(req.userSession.deviceId, req.userSession.userId);
    if (isError(result)) {
      return sendError({ res, httpStatus: HttpStatus.Unauthorized, errors: result.extensions });
    }
    clearRefreshCookie(req, res);
    sendResult({ res, result });
  }
  async refreshToken(
    req: SessionRequest<JWTUserInfo<JWTType.REFRESH>>,
    res: Response<{ accessToken: string } | ValidationErrorMessages>,
  ) {
    const result = await this.authService.refreshToken(
      req.userSession.deviceId,
      req.userSession.userId,
    );
    if (isError(result))
      return sendError({ res, httpStatus: HttpStatus[result.status], errors: result.extensions });
    setRefreshCookie(req, res, result.data.refreshToken.token, result.data.refreshToken.exp);
    sendResult({ res, result, mapper: authTokenToOutputMapper });
  }
  async registration(
    req: SanitizedRequest<UserInputModel>,
    res: Response<ValidationErrorMessages | undefined>,
  ) {
    const result = await this.authService.createUser(req.validData.body);
    sendResult({ res, result, overwriteSuccessStatus: ResultSuccessStatus.NoContent });
  }
  async registrationConfirm(
    req: SanitizedRequest<{
      code: string;
    }>,
    res: Response<ValidationErrorMessages | undefined>,
  ) {
    const result = await this.authService.registrationConfirmAuth(req.validData.body.code);
    sendResult({ res, result });
  }
  async registrationEmailResending(
    req: SanitizedRequest<{
      email: string;
    }>,
    res: Response<ValidationErrorMessages | undefined>,
  ) {
    const result = await this.authService.registrationEmailResendingAuth(req.validData.body.email);
    sendResult({ res, result });
  }
  async passwordRecovery(
    req: SanitizedRequest<{
      email: string;
    }>,
    res: Response<undefined | ValidationErrorMessages>,
  ) {
    const result = await this.authService.passwordRecoveryAuth(req.validData.body.email);
    sendResult({ res, result });
  }
  async updatePassword(
    req: SanitizedRequest<{
      recoveryCode: string;
      newPassword: string;
    }>,
    res: Response<undefined | ValidationErrorMessages>,
  ) {
    const result = await this.authService.updatePassword(
      req.validData.body.recoveryCode,
      req.validData.body.newPassword,
    );
    sendResult({ res, result });
  }

  async getMeJWE(
    req: SessionRequest<UserOutputModel>,
    res: Response<AuthOutputModel | ValidationErrorMessages>,
  ) {
    const user = await this.usersQueryRepository.getUser(req.userSession.id);
    sendResult({ res, result: user });
  }
  async loginJWE(
    req: SanitizedRequest<AuthInputModel>,
    res: Response<{ accessToken: string } | ValidationErrorMessages>,
  ) {
    const meta = collectMetaRequest(req);
    const result = await this.authService.login(req.validData.body, meta, "jwe");
    sendResult({ res, result, mapper: authTokenToOutputMapper });
  }
}
