import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { securityDevicesQueryRepository } from "../repository/securityDevices-query.repository";
import { SecurityDeviceOutputModel } from "../types/securityDevice-output";
import { SessionRequest } from "../../../core/types/express.type";
import { JWTType, JWTUserInfo } from "../../../core/adapters/jwt.adapter";

export const getSecurityDevicesHandler = async (
  req: SessionRequest<JWTUserInfo<JWTType.REFRESH>>,
  res: Response<SecurityDeviceOutputModel[] | ValidationErrorMessages>,
) => {
  const sessions = await securityDevicesQueryRepository.getAllSession(req.userSession.userId);
  sendResult({ res, result: sessions });
};
