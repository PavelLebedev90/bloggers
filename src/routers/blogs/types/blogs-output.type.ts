import { PaginationMetaView } from "../../../core/types/query.type";

export type BlogOutputModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogOutputModelWithMeta = PaginationMetaView & {
  items: BlogOutputModel[];
};
