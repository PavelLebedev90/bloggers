import { injectable } from "inversify";
import { ResultSuccessStatus } from "../../../core/types/result.type";
import { okResult } from "../../../core/utils/formatters/result/result.formatter";
import { securityDevicesCollection } from "../../../db/collections";
import { securityDevicesToOutputMapper } from "../mappers/securityDevices-to-output.mapper";
@injectable()
export class SecurityDevicesQueryRepository {
  async getAllSession(currentUserId: string) {
    const result = await securityDevicesCollection.find({ userId: currentUserId }).toArray();
    return okResult({
      data: securityDevicesToOutputMapper(result),
      status: ResultSuccessStatus.Ok,
    });
  }
}
