import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { testingRepository } from "../repository/testing.repository";

export const deleteTestingHandler = async (_req: Request, res: Response) => {
  await testingRepository.clearDB();
  res.sendStatus(HttpStatus.NoContent);
};
