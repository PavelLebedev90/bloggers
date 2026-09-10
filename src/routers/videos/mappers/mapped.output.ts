import { VideoDBModel } from "../types/video.db";
import { VideoResponseModel } from "../types/video.output";

export const mappedVideo = (video: VideoDBModel): VideoResponseModel => {
  const {
    id,
    author,
    availableResolutions,
    canBeDownloaded,
    createdAt,
    minAgeRestriction,
    publicationDate,
    title,
  } = video;
  return {
    id,
    author,
    availableResolutions,
    canBeDownloaded,
    createdAt,
    minAgeRestriction,
    publicationDate,
    title,
  };
};

export const mappedOutput = (dbData: VideoDBModel[]) => {
  return dbData.map(mappedVideo);
};
