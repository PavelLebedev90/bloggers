import { UserInputModel } from "../../../src/modules/users/types/users-input.type";

export const collectUserToCreate = (): UserInputModel => {
  return {
    login: "user1",
    password: "qwerty1",
    email: "user1@example.com",
  };
};
