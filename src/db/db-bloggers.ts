import { VideoDBModel } from "@/routers/videos/types/video.db";

export const db = {
  videos: <VideoDBModel[]>[
    {
      id: 1,
      author: "Pavel",
      title: "Backend with zero",
      availableResolutions: ["P2160"],
      canBeDownloaded: false,
      createdAt: new Date().toISOString(),
      db_number: 777,
      minAgeRestriction: 14,
      publicationDate: new Date().toISOString(),
    },
  ],
};
