import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { securityDevicesQueryRepository } from "../repository/securityDevices-query.repository";
import { SecurityDeviceOutputModel } from "../types/securityDevices-output";

export const getSecurityDevicesHandler = async (
  _req: Request,
  res: Response<
    SecurityDeviceOutputModel[] | ValidationErrorMessages,
    {
      cookie: {
        userId: string;
      };
    }
  >,
) => {
  const sessions = await securityDevicesQueryRepository.getAllSession(res.locals.cookie.userId);
  sendResult({ res, result: sessions });
};
