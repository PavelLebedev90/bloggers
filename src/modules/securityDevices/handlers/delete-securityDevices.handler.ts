import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { securityDevicesService } from "../service/securityDevices.service";
import { SessionRequest } from "../../../core/types/express.type";
import { JWTType, JWTUserInfo } from "../../../core/adapters/jwt.adapter";

export const deleteSecurityDevicesHandler = async (
  req: SessionRequest<JWTUserInfo<JWTType.REFRESH>>,
  res: Response<ValidationErrorMessages>,
) => {
  const deletedResult = await securityDevicesService.deleteAllSessionExcludeCurrent(
    req.userSession.deviceId,
    req.userSession.userId,
  );
  sendResult({ res, result: deletedResult });
};
