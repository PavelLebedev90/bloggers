import { Resolutions } from "./video.db";

export type VideoCreateModel = {
  title: string;
  author: string;
  availableResolutions: Resolutions[];
};

export type VideoUpdateModel = {
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
  availableResolutions: Resolutions[];
};
