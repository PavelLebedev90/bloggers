import { Response } from "express";
import { usersService } from "../service/users.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const deleteUserHandler = async (
  req: SanitizedRequest<unknown, unknown, { id: string }>,
  res: Response,
) => {
  const result = await usersService.deleteUser(req.validData.params.id);
  sendResult({ res, result });
};
