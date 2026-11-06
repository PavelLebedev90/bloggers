import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import { ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import {
  failResult,
  isSuccess,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";
import { securityDevicesRepository } from "../repository/securityDevices.repository";
import { SecurityDeviceDBModel } from "../types/securityDevice-db";

export const securityDevicesService = {
  async getAllSession(userId: string) {
    const result = await securityDevicesRepository.getAllSession(userId);
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: result,
    });
  },
  async getSessionByDeviceId(deviceId: string) {
    const session = await securityDevicesRepository.getSessionByDeviceId(deviceId);
    if (!session) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.Unauthorized("device id", deviceId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: session,
    });
  },
  async createSession(session: SecurityDeviceDBModel) {
    const { insertedId } = await securityDevicesRepository.createSession(session);
    return okResult({
      status: ResultSuccessStatus.Created,
      data: insertedId.toString(),
    });
  },
  async updateSession(session: SecurityDeviceDBModel) {
    const isUpdated = await securityDevicesRepository.updateSession(session);
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: isUpdated,
    });
  },
  async deleteAllSessionExcludeCurrent(currentDeviceId: string, userId: string) {
    const isDeleted = await securityDevicesRepository.deleteAllSessionExcludeCurrent(
      currentDeviceId,
      userId,
    );
    if (!isDeleted) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("device id", currentDeviceId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isDeleted,
    });
  },
  async deleteSessionByDeviceId(deviceId: string, userId: string) {
    const session = await this.getSessionByDeviceId(deviceId);
    if (isSuccess(session) && session.data.userId !== userId) {
      return failResult({
        status: ResultErrorStatus.Forbidden,
        extensions: [ERROR_MESSAGES.Forbidden("user id", userId)],
      });
    }
    const isDeleted = await securityDevicesRepository.deleteSessionByDeviceId(deviceId, userId);
    if (!isDeleted) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("device id", deviceId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isDeleted,
    });
  },
  collectSessionInfo(meta: {
    ip: string;
    userAgent: string;
    userId: string;
    exp: Date;
    deviceId: string;
  }): SecurityDeviceDBModel {
    return {
      expiresAt: meta.exp,
      userId: meta.userId,
      deviceId: meta.deviceId,
      ip: meta.ip,
      title: meta.userAgent,
      issuedAt: new Date(),
    };
  },
};
