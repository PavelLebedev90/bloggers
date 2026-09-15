import { Response, Request } from "express";

import { HttpStatus } from "../../../core/types/http-statuses";
import { db } from "../../../db/db-bloggers";
import { mappedVideo } from "../mappers/mapped.output";
import { VideoResponseModel } from "../types/video.output";

export const getVideoHandler = (
  req: Request<{ id: string }>,
  res: Response<VideoResponseModel>,
) => {
  const requestId = parseInt(req.params.id);
  if (isNaN(requestId)) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  const dbVideo = db.videos.find((video) => video.id === requestId);

  if (!dbVideo) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  const outputData = mappedVideo(dbVideo);
  res.status(HttpStatus.Ok).send(outputData);
};
