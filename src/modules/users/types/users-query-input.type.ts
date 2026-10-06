import { Queries } from "../../../core/types/query.type";

export enum UserSortBy {
  EMAIL = "email",
  CREATED_AT = "createdAt",
  LOGIN = "login",
}

export type UserQueryInputModel = Queries<UserSortBy> & {
  searchLoginTerm: string;
  searchEmailTerm: string;
};
