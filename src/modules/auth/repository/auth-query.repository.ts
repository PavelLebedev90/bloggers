import { usersCollection } from "../../../db/collections";

export const authQueryRepository = {
  async getUserByLoginOrEmail(loginOrEmail: string) {
    const user = await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return user;
  },
};
