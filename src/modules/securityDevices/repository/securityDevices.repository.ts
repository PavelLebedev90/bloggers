import { injectable } from "inversify";
import { securityDevicesCollection } from "../../../db/collections";
import { SecurityDeviceDBModel } from "../types/securityDevice-db";
@injectable()
export class SecurityDevicesRepository {
  async getAllSession(currentUserId: string) {
    return await securityDevicesCollection.find({ userId: currentUserId }).toArray();
  }
  async getSessionByDeviceId(deviceId: string) {
    return await securityDevicesCollection.findOne({ deviceId });
  }
  async createSession(session: SecurityDeviceDBModel) {
    return await securityDevicesCollection.insertOne(session);
  }
  async updateSession(session: SecurityDeviceDBModel) {
    const result = await securityDevicesCollection.updateOne(
      { deviceId: session.deviceId },
      { $set: session },
    );
    return result.matchedCount === 1;
  }
  async deleteAllSessionExcludeCurrent(currentDeviceId: string, currentUserId: string) {
    const result = await securityDevicesCollection.deleteMany({
      deviceId: { $ne: currentDeviceId },
      userId: currentUserId,
    });
    return result.deletedCount >= 1;
  }
  async deleteSessionByDeviceId(deviceId: string, currentUserId: string) {
    const result = await securityDevicesCollection.deleteOne({ deviceId, userId: currentUserId });
    return result.deletedCount === 1;
  }
}
