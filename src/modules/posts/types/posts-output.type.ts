import { PaginationMetaView } from "../../../core/types/query.type";

export type PostOutputModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type PostOutputModelWithMeta = PaginationMetaView & {
  items: PostOutputModel[];
};
