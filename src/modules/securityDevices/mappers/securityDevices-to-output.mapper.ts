import { WithId } from "mongodb";
import { SecurityDeviceDBModel } from "../types/securityDevices-db";
import { SecurityDeviceOutputModel } from "../types/securityDevices-output";

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
