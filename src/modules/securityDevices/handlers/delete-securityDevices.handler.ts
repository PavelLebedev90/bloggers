import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { securityDevicesService } from "../service/securityDevices.service";

export const deleteSecurityDevicesHandler = async (
  __req: Request,
  res: Response<
    ValidationErrorMessages,
    {
      cookie: {
        userId: string;
        deviceId: string;
      };
    }
  >,
) => {
  const deletedResult = await securityDevicesService.deleteAllSessionExcludeCurrent(
    res.locals.cookie.deviceId,
    res.locals.cookie.userId,
  );
  sendResult({ res, result: deletedResult });
};
