import { Resolutions } from "./video.db";

export type VideoResponseModel = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Resolutions[];
};
