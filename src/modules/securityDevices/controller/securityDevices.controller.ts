import { Response } from "express";
import { inject, injectable } from "inversify";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest, SessionRequest } from "../../../core/types/express.type";
import { JWTType, JWTUserInfo } from "../../../core/adapters/jwt.adapter";
import { SecurityDeviceOutputModel } from "../types/securityDevice-output";
import { SecurityDevicesQueryRepository } from "../repository/securityDevices-query.repository";
import { SecurityDevicesService } from "../service/securityDevices.service";

@injectable()
export class SecurityDevicesController {
  constructor(
    @inject(SecurityDevicesQueryRepository)
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    @inject(SecurityDevicesService)
    private securityDevicesService: SecurityDevicesService,
  ) {}
  async getSecurityDevices(
    req: SessionRequest<JWTUserInfo<JWTType.REFRESH>>,
    res: Response<SecurityDeviceOutputModel[] | ValidationErrorMessages>,
  ) {
    const sessions = await this.securityDevicesQueryRepository.getAllSession(
      req.userSession.userId,
    );
    sendResult({ res, result: sessions });
  }
  async deleteAllSessionExcludeCurrent(
    req: SessionRequest<JWTUserInfo<JWTType.REFRESH>>,
    res: Response<ValidationErrorMessages>,
  ) {
    const deletedResult = await this.securityDevicesService.deleteAllSessionExcludeCurrent(
      req.userSession.deviceId,
      req.userSession.userId,
    );
    sendResult({ res, result: deletedResult });
  }
  async deleteSessionByDeviceId(
    req: SanitizedRequest<
      unknown,
      unknown,
      { deviceId: string },
      unknown,
      JWTUserInfo<JWTType.REFRESH>
    >,
    res: Response<ValidationErrorMessages>,
  ) {
    const deletedResult = await this.securityDevicesService.deleteSessionByDeviceId(
      req.validData.params.deviceId,
      req.userSession.userId,
    );
    sendResult({ res, result: deletedResult });
  }
}
