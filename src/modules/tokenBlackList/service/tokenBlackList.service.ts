import { Result, ResultSuccessStatus } from "../../../core/types/result.type";
import { okResult } from "../../../core/utils/formatters/result/result.formatter";
import { tokenBlackListRepository } from "../repository/tokenBlackList.repository";
import { TokenBlackList } from "../types/tokenBlackList-db";

export const tokenBlackListService = {
  async getBlackTokenByTOken(token: string) {
    const result = await tokenBlackListRepository.getBlackTokenByTOken(token);
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: result,
    });
  },
  async create(blackList: TokenBlackList): Promise<Result<string>> {
    const { insertedId } = await tokenBlackListRepository.create(blackList);
    return okResult({
      status: ResultSuccessStatus.Created,
      data: insertedId.toString(),
    });
  },
};
