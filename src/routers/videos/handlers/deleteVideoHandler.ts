import { Response, Request } from "express";

import { HttpStatus } from "../../../core/types/http-statuses";
import { db } from "../../../db/db-bloggers";
import { VideoDBModel } from "../types/video.db";

export const deleteVideoHandler = (req: Request<{ id: string }>, res: Response) => {
  const requestId = parseInt(req.params.id);
  if (isNaN(requestId)) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  let isNotFoundVideo = true;
  db.videos = db.videos.reduce((acc, video) => {
    if (video.id === requestId) {
      isNotFoundVideo = false;
    } else {
      acc.push(video);
    }

    return acc;
  }, [] as VideoDBModel[]);

  if (isNotFoundVideo) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
};
