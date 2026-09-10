import { HttpStatus } from "@/core/types/http-statuses";
import { db } from "@/db/db-bloggers";
import { Router } from "express";

export const testingRouter: Router = Router({});

const TESTING_ROUTER_PATH = "/all-data";

testingRouter.delete(TESTING_ROUTER_PATH, (_req, res) => {
  db.videos = [];
  res.sendStatus(HttpStatus.NoContent);
});
