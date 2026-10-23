import { usersCollection } from "../../../db/collections";
import { Filter, ObjectId } from "mongodb";
import { UserDBModel } from "../types/users-db.type";
import { UserQueryInputModel } from "../types/users-query-input.type";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import { UserOutputModel } from "../types/users-output.type";
import { usersToOutputMapper, userToOutputMapper } from "../mappers/user-to-output.mapper";

export const usersQueryRepository = {
  async getAll(
    query: UserQueryInputModel,
  ): Promise<Result<{ items: UserOutputModel[]; totalCount: number }>> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const filter: Filter<UserDBModel> = {};
    const filterQuery = {
      email: query.searchEmailTerm,
      login: query.searchLoginTerm,
    };
    Object.entries(filterQuery)
      .filter(([, value]) => !!value)
      .forEach(([key, value]) => {
        if (!filter.$or) {
          filter.$or = [];
        }
        filter.$or.push({ [key]: { $regex: value, $options: "i" } });
      });

    const [items, totalCount] = await Promise.all([
      usersCollection
        .find(filter)
        .sort(query.sortBy, query.sortDirection)
        .skip(skip)
        .limit(query.pageSize)
        .toArray(),
      usersCollection.countDocuments(filter),
    ]);

    return okResult({
      status: ResultSuccessStatus.Ok,
      data: { items: usersToOutputMapper(items), totalCount },
    });
  },
  async getUser(userId: string): Promise<Result<UserOutputModel>> {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("user id", userId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: userToOutputMapper(user),
    });
  },
};
