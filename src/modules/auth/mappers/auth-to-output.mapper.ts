import { AuthOutputModel } from "../types/auth-output.type";
import { UserOutputModel } from "../../users/types/users-output.type";

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

export const authToOutputMapper = (user: UserOutputModel): AuthOutputModel => {
  const { id, email, login } = user;
  return {
    userId: id,
    email,
    login,
  };
};

export const authTokenToOutputMapper = (payload: Tokens) => ({
  accessToken: payload.accessToken.token,
});
