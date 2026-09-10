import { Router, Response, Request } from "express";
import { VideoResponseModel } from "./types/video.output";
import { db } from "../../db/db-bloggers";
import { mappedOutput, mappedVideo } from "./mappers/mapped.output";
import { HttpStatus } from "../../core/types/http-statuses";
import { VideoCreateModel, VideoUpdateModel } from "./types/video.input";
import { mappedToDB } from "./mappers/mapped.toDB";
import { VideoDBModel } from "./types/video.db";
import { validateVideosInput, ValidationType } from "./validation/validation.body";
import { ValidationErrorMessages } from "../../core/types/validation-error";

export const videosRouter: Router = Router({});

videosRouter.get("/", (_req, res: Response<VideoResponseModel[]>) => {
  const outputData = mappedOutput(db.videos);
  res.status(HttpStatus.Ok).send(outputData);
});

videosRouter.get("/:id", (req: Request<{ id: string }>, res: Response<VideoResponseModel>) => {
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
});

videosRouter.post(
  "/",
  (
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
  },
);

videosRouter.put(
  "/:id",
  (
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
  },
);

videosRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
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
});
