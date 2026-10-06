import { PaginationMetaView } from "../../../core/types/query.type";

export type UserOutputModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserOutputModelWithMeta = PaginationMetaView & {
  items: UserOutputModel[];
};
