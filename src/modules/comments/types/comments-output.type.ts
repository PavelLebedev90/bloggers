import { PaginationMetaView } from "../../../core/types/query.type";

export type CommentOutputModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
};

export type CommentOutputModelWithMeta = PaginationMetaView & {
  items: CommentOutputModel[];
};
