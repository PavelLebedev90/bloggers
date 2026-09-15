export const BASE_PATH = process.env.BASE_PATH || "";

export const ROUTER_PATH = {
  TESTING: {
    ROOT: "testing",
    BASE: "/",
    ALL_DATA: "/all-date",
  },
  VIDEOS: {
    ROOT: "videos",
    BASE: "/",
    BY_ID: "/:id",
  },
} as const;
