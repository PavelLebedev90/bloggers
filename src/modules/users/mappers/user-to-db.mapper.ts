import { UserDBModel } from "../types/users-db.type";
import { UserInputModel } from "../types/users-input.type";

export const userToDBMapper = (
  user: UserInputModel,
): Omit<UserDBModel, "createdAt" | "passwordHash"> => {
  return {
    email: user.email,
    login: user.login,
  };
};
