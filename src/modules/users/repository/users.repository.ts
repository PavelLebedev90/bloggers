import { usersCollection } from "../../../db/collections";
import { ObjectId } from "mongodb";
import { UserDBModel } from "../types/users-db.type";

export const usersRepository = {
  async createUser(bodyUser: UserDBModel) {
    const { insertedId } = await usersCollection.insertOne(bodyUser);
    return insertedId.toString();
  },
  async deleteUser(userId: string) {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount === 1;
  },
};
