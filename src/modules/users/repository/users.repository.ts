import { usersCollection } from "../../../db/collections";
import { Filter, ObjectId } from "mongodb";
import { UserDBModel } from "../types/users-db.type";
import { injectable } from "inversify";
@injectable()
export class UsersRepository {
  async getUser(userId: string) {
    return await usersCollection.findOne({ _id: new ObjectId(userId) });
  }
  async getUserByLoginOrEmail(loginOrEmail: string | { login?: string; email?: string }) {
    const filter: Filter<UserDBModel> = {};
    if (typeof loginOrEmail !== "object") {
      filter.$or = [{ login: loginOrEmail }, { email: loginOrEmail }];
    }
    if (typeof loginOrEmail === "object") {
      if (loginOrEmail.login && loginOrEmail.email) {
        filter.$or = [{ login: loginOrEmail.login }, { email: loginOrEmail.email }];
      }
      if (loginOrEmail.login) {
        filter.login = loginOrEmail.login;
      }
      if (loginOrEmail.email) {
        filter.email = loginOrEmail.email;
      }
    }
    const user = await usersCollection.findOne(filter);
    return user;
  }
  async getUserByEmailConfirmationCode(emailConfirmationCode: string) {
    return await usersCollection.findOne({
      emailConfirmationCode,
    });
  }
  async createUser(bodyUser: UserDBModel) {
    const { insertedId } = await usersCollection.insertOne(bodyUser);
    return insertedId.toString();
  }
  async updateUser<T extends keyof UserDBModel = "createdAt" | "passwordHash">(
    userId: string,
    bodyUser: Omit<UserDBModel, T>,
  ) {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: bodyUser },
    );
    return result.matchedCount === 1;
  }
  async deleteUser(userId: string) {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount === 1;
  }
}
