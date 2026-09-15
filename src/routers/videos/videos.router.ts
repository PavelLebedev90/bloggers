import { Router } from "express";
import { getVideoListHandler } from "./handlers/getVideoListHandler";
import { getVideoHandler } from "./handlers/getVideoHandler";
import { createVideoHandler } from "./handlers/createVideoHandler";
import { updateVideoHandler } from "./handlers/updateVideoHandler";
import { deleteVideoHandler } from "./handlers/deleteVideoHandler";
import { ROUTER_PATH } from "../../core/consts/routers-path";

export const videosRouter: Router = Router({});

const VIDEO_PATH = ROUTER_PATH.VIDEOS;

videosRouter.get(VIDEO_PATH.BASE, getVideoListHandler);
videosRouter.get(VIDEO_PATH.BY_ID, getVideoHandler);
videosRouter.post(VIDEO_PATH.BASE, createVideoHandler);
videosRouter.put(VIDEO_PATH.BY_ID, updateVideoHandler);
videosRouter.delete(VIDEO_PATH.BY_ID, deleteVideoHandler);
