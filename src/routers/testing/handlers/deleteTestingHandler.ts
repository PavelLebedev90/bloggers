import { Response, Request } from "express";

import { HttpStatus } from "../../../core/types/http-statuses";
import { db } from "../../../db/db-bloggers";

export const deleteTestingHandler = (_req: Request, res: Response) => {
  db.videos = [];
  res.sendStatus(HttpStatus.NoContent);
};
