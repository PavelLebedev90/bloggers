import { VideoDBModel } from "../types/video.db";
import { VideoCreateModel } from "../types/video.input";

export const mappedToDB = (video: VideoCreateModel, newId: number): VideoDBModel => {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  return {
    id: newId,
    db_number: Math.random() + 1000,
    title: video.title,
    author: video.author,
    availableResolutions: video.availableResolutions,
    minAgeRestriction: null,
    canBeDownloaded: false,
    createdAt: new Date().toISOString(),
    publicationDate: tomorrowDate.toISOString(),
  };
};
