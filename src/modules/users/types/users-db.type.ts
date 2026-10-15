export type UserModel = {
  login: string;
  email: string;
};

export type UserEmailConfirmation = {
  emailConfirmationCode: string | null;
  emailConfirmationExpirationDate: Date | null;
  emailConfirmationIsConfirmed: boolean;
};

export type UserDBModel = UserModel &
  UserEmailConfirmation & {
    createdAt: Date;
    passwordHash: string;
  };
