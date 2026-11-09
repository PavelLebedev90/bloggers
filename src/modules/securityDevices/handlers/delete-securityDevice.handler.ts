import { Response } from "express";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { securityDevicesService } from "../service/securityDevices.service";
import { SanitizedRequest } from "../../../core/types/express.type";
import { JWTType, JWTUserInfo } from "../../../core/adapters/jwt.adapter";

export const deleteSecurityDeviceHandler = async (
  req: SanitizedRequest<
    unknown,
    unknown,
    { deviceId: string },
    unknown,
    JWTUserInfo<JWTType.REFRESH>
  >,
  res: Response<ValidationErrorMessages>,
) => {
  const deletedResult = await securityDevicesService.deleteSessionByDeviceId(
    req.validData.params.deviceId,
    req.userSession.userId,
  );
  sendResult({ res, result: deletedResult });
};
