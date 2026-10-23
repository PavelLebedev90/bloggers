import { Response, Request } from "express";
import { usersService } from "../service/users.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const deleteUserHandler = async (
  _req: Request,
  res: Response<unknown, { params: { id: string } }>,
) => {
  const result = await usersService.deleteUser(res.locals.params.id);
  sendResult({ res, result });
};
