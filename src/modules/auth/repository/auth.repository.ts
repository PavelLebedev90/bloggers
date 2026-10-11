import { usersCollection } from "../../../db/collections";

export const authRepository = {
  async getUserByLoginOrEmail(loginOrEmail: string) {
    const user = await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return user;
  },
};
