import { Response, Request } from "express";

import { HttpStatus } from "../../../core/types/http-statuses";
import { ValidationErrorMessages } from "../../../core/types/validation-error";
import { db } from "../../../db/db-bloggers";
import { VideoUpdateModel } from "../types/video.input";
import { VideoResponseModel } from "../types/video.output";
import { validateVideosInput, ValidationType } from "../validation/validation.body";

export const updateVideoHandler = (
  req: Request<{ id: string }, unknown, VideoUpdateModel>,
  res: Response<VideoResponseModel | ValidationErrorMessages>,
) => {
  const requestId = parseInt(req.params.id);
  if (isNaN(requestId)) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  let updatedDbVideo = db.videos.find((video) => video.id === requestId);

  if (!updatedDbVideo) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const newVideo: VideoUpdateModel = {
    author: req.body.author,
    availableResolutions: req.body.availableResolutions,
    canBeDownloaded: req.body.canBeDownloaded,
    minAgeRestriction: req.body.minAgeRestriction,
    publicationDate: req.body.publicationDate,
    title: req.body.title,
  };

  const validationErrors = validateVideosInput(ValidationType.UPDATE, newVideo);
  if (validationErrors.errorsMessages.length) {
    res.status(HttpStatus.BadRequest).send(validationErrors);
    return;
  }

  updatedDbVideo.author = newVideo.author;
  updatedDbVideo.availableResolutions = newVideo.availableResolutions;
  updatedDbVideo.canBeDownloaded = newVideo.canBeDownloaded;
  updatedDbVideo.minAgeRestriction = newVideo.minAgeRestriction;
  updatedDbVideo.publicationDate = newVideo.publicationDate;
  updatedDbVideo.title = newVideo.title;

  res.sendStatus(HttpStatus.NoContent);
};
