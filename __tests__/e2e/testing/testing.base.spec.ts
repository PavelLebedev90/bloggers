import request from "supertest";
import { HttpStatus } from "@/core/types/http-statuses";
import { VideoCreateModel } from "@/routers/videos/types/video.input";
import { app, TESTING_PATH, VIDEOS_PATH } from "../../utils/config";

describe("testing all-data", () => {
  beforeEach(async () => {
    await request(app).delete(`${TESTING_PATH}/all-data`);
  });
  it("should clear all videos from the DB", async () => {
    await request(app)
      .post(VIDEOS_PATH)
      .send({
        title: "Video to be wiped",
        author: "Author",
        availableResolutions: ["P1080"],
      } satisfies VideoCreateModel);

    const listBeforeRes = await request(app).get(VIDEOS_PATH);
    expect(listBeforeRes.body).toHaveLength(1);

    const deleteRes = await request(app).delete(`${TESTING_PATH}/all-data`);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const listAfterRes = await request(app).get(VIDEOS_PATH);
    expect(listAfterRes.status).toBe(HttpStatus.Ok);
    expect(listAfterRes.body).toEqual([]);
  });

  it("should be idempotent when the DB is already empty", async () => {
    await request(app).delete(`${TESTING_PATH}/all-data`);

    const deleteRes = await request(app).delete(`${TESTING_PATH}/all-data`);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const listRes = await request(app).get(VIDEOS_PATH);
    expect(listRes.body).toEqual([]);
  });
});
