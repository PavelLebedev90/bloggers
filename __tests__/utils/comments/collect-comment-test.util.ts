import { CommentInputModel } from "../../../src/modules/comments/types/comments-input.type";

export const collectCommentToCreate = (): CommentInputModel => {
  return {
    content: "Это тестовый комментарий длиной более двадцати символов.",
  };
};
