import { Response, Request } from "express";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { securityDevicesService } from "../service/securityDevices.service";

export const deleteSecurityDeviceHandler = async (
  __req: Request,
  res: Response<
    ValidationErrorMessages,
    {
      params: { deviceId: string };
      cookie: {
        userId: string;
        deviceId: string;
      };
    }
  >,
) => {
  const deletedResult = await securityDevicesService.deleteSessionByDeviceId(
    res.locals.params.deviceId,
    res.locals.cookie.userId,
  );
  sendResult({ res, result: deletedResult });
};
