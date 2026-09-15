import { Response, Request } from "express";

import { HttpStatus } from "../../../core/types/http-statuses";
import { db } from "../../../db/db-bloggers";
import { mappedOutput } from "../mappers/mapped.output";
import { VideoResponseModel } from "../types/video.output";

export const getVideoListHandler = (_req: Request, res: Response<VideoResponseModel[]>) => {
  const outputData = mappedOutput(db.videos);
  res.status(HttpStatus.Ok).send(outputData);
};
