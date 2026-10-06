import { usersCollection } from "../../../db/collections";
import { Filter, ObjectId } from "mongodb";
import { UserDBModel } from "../types/users-db.type";
import { UserQueryInputModel } from "../types/users-query-input.type";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";

export const usersQueryRepository = {
  async getAll(query: UserQueryInputModel) {
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

    return { items, totalCount };
  },
  async getUser(userId: string) {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("user id", userId));
    }
    return user;
  },
};
