import { tokenBlackListCollection } from "../../../db/collections";
import { TokenBlackList } from "../types/tokenBlackList-db";

export const tokenBlackListRepository = {
  async getBlackTokenByTOken(token: string) {
    return await tokenBlackListCollection.findOne({ token });
  },
  async create(blackList: TokenBlackList) {
    return await tokenBlackListCollection.insertOne(blackList);
  },
};
