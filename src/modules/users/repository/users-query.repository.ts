import { usersCollection } from "../../../db/collections";
import { Filter, ObjectId, WithId } from "mongodb";
import { UserDBModel } from "../types/users-db.type";
import { UserQueryInputModel } from "../types/users-query-input.type";
import {
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
} from "../../../core/types/validation-error.type";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/error.messages.const";

export const usersQueryRepository = {
  async getAll(
    query: UserQueryInputModel,
  ): Promise<Result<{ items: WithId<UserDBModel>[]; totalCount: number }>> {
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
      data: { items, totalCount },
    });
  },
  async getUser(userId: string): Promise<Result<WithId<UserDBModel>>> {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("user id", userId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: user,
    });
  },
};
