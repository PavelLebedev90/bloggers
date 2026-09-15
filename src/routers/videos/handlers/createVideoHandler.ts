import { Response, Request } from "express";

import { HttpStatus } from "../../../core/types/http-statuses";
import { db } from "../../../db/db-bloggers";
import { mappedVideo } from "../mappers/mapped.output";
import { mappedToDB } from "../mappers/mapped.toDB";
import { VideoCreateModel } from "../types/video.input";
import { validateVideosInput, ValidationType } from "../validation/validation.body";
import { VideoResponseModel } from "../types/video.output";
import { ValidationErrorMessages } from "../../../core/types/validation-error";

export const createVideoHandler = (
  req: Request<unknown, unknown, VideoCreateModel>,
  res: Response<VideoResponseModel | ValidationErrorMessages>,
) => {
  const newVideo: VideoCreateModel = {
    author: req.body.author,
    availableResolutions: req.body.availableResolutions,
    title: req.body.title,
  };

  const validationErrors = validateVideosInput(ValidationType.CREATE, newVideo);
  if (validationErrors.errorsMessages.length) {
    res.status(HttpStatus.BadRequest).send(validationErrors);
    return;
  }

  const newId = db.videos.at(-1)?.id ?? 0;
  const newDBVideo = mappedToDB(newVideo, newId + 1);
  db.videos.push(newDBVideo);

  const outputData = mappedVideo(newDBVideo);

  res.status(HttpStatus.Created).send(outputData);
};
