import { WithId } from "mongodb";
import { UserDBModel } from "../types/users-db.type";
import { UserOutputModel } from "../types/users-output.type";

export const userToOutputMapper = (user: WithId<UserDBModel>): UserOutputModel => {
  const { createdAt, email, login } = user;
  return {
    id: user._id.toString(),
    email,
    login,
    createdAt,
  };
};

export const usersToOutputMapper = (dbData: WithId<UserDBModel>[]) => {
  return dbData.map(userToOutputMapper);
};
