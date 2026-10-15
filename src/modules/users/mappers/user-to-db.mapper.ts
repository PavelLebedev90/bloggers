import { UserModel } from "../types/users-db.type";
import { UserInputModel } from "../types/users-input.type";

export const userToDBMapper = (user: UserInputModel): UserModel => {
  return {
    email: user.email,
    login: user.login,
  };
};
