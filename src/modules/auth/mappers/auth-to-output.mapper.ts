import { WithId } from "mongodb";
import { UserDBModel } from "../../users/types/users-db.type";
import { AuthOutputModel } from "../types/auth-output.type";

export type Tokens = {
  accessToken: {
    token: string;
    exp: Date;
  };
  refreshToken: {
    token: string;
    exp: Date;
  };
};

export const authToOutputMapper = (user: WithId<UserDBModel>): AuthOutputModel => {
  const { _id, email, login } = user;
  return {
    userId: _id.toString(),
    email,
    login,
  };
};

export const authTokenToOutputMapper = (payload: Tokens) => ({
  accessToken: payload.accessToken.token,
});
