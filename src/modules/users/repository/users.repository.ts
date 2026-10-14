import { usersCollection } from "../../../db/collections";
import { ObjectId } from "mongodb";
import { UserDBModel } from "../types/users-db.type";

export const usersRepository = {
  async getUserByLoginOrEmail(loginOrEmail: string | { login: string; email: string }) {
    let login = loginOrEmail;
    let email = loginOrEmail;
    if (typeof loginOrEmail === "object") {
      login = loginOrEmail.login;
      email = loginOrEmail.email;
    }
    const user = await usersCollection.findOne({
      $or: [{ login }, { email }],
    });
    return user;
  },
  async createUser(bodyUser: UserDBModel) {
    const { insertedId } = await usersCollection.insertOne(bodyUser);
    return insertedId.toString();
  },
  async deleteUser(userId: string) {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount === 1;
  },
};
