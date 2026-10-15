import { randomUUID } from "node:crypto";
import { UserEmailConfirmation } from "../types/users-db.type";

export const userEmailConfirmationToDBMapper = (payload: {
  isConfirmed: boolean;
}): UserEmailConfirmation => {
  return {
    emailConfirmationCode: payload.isConfirmed ? null : randomUUID(),
    emailConfirmationExpirationDate: payload.isConfirmed
      ? null
      : new Date(Date.now() + 10 * 60 * 1000), // 10min
    emailConfirmationIsConfirmed: payload.isConfirmed,
  };
};
