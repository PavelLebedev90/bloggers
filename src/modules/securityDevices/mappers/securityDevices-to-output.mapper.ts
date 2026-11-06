import { WithId } from "mongodb";
import { SecurityDeviceDBModel } from "../types/securityDevice-db";
import { SecurityDeviceOutputModel } from "../types/securityDevice-output";

export const securityDeviceToOutputMapper = (
  session: WithId<SecurityDeviceDBModel>,
): SecurityDeviceOutputModel => {
  const { deviceId, ip, issuedAt, title } = session;
  return {
    deviceId,
    ip,
    lastActiveDate: issuedAt,
    title,
  };
};

export const securityDevicesToOutputMapper = (dbData: WithId<SecurityDeviceDBModel>[]) => {
  return dbData.map(securityDeviceToOutputMapper);
};
