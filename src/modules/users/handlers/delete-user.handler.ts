import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { usersService } from "../service/users.service";

export const deleteUserHandler = async (
  _req: Request,
  res: Response<unknown, { params: { id: string } }>,
) => {
  await usersService.deleteUser(res.locals.params.id);
  res.sendStatus(HttpStatus.NoContent);
};
