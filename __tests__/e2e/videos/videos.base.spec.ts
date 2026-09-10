import request from "supertest";
import { HttpStatus } from "@/core/types/http-statuses";
import { VideoCreateModel, VideoUpdateModel } from "@/routers/videos/types/video.input";
import { VideoResponseModel } from "@/routers/videos/types/video.output";
import { app, TESTING_PATH, VIDEOS_PATH } from "../../utils/config";
import { Resolutions } from "@/routers/videos/types/video.db";

describe("videos CRUD", () => {
  beforeEach(async () => {
    await request(app).delete(`${TESTING_PATH}/all-data`);
  });

  it("should return an empty array when there are no videos", async () => {
    const res = await request(app).get(VIDEOS_PATH);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body).toEqual([]);
  });

  it("should create a new video and return it", async () => {
    const newVideo: VideoCreateModel = {
      title: "Backend with zero",
      author: "Ivan",
      availableResolutions: [Resolutions.P1080],
    };

    const res = await request(app).post(VIDEOS_PATH).send(newVideo);

    expect(res.status).toBe(HttpStatus.Created);
    expect(res.body).toEqual<VideoResponseModel>({
      id: 1,
      title: newVideo.title,
      author: newVideo.author,
      availableResolutions: newVideo.availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });
  });

  it("should set publicationDate to tomorrow (current date + 1 day) on creation", async () => {
    const newVideo: VideoCreateModel = {
      title: "Publication date check",
      author: "Author",
      availableResolutions: [Resolutions.P1080],
    };

    const res = await request(app).post(VIDEOS_PATH).send(newVideo);

    expect(res.status).toBe(HttpStatus.Created);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const actualDate = new Date(res.body.publicationDate as string).toISOString().slice(0, 10);
    const expectedDate = tomorrow.toISOString().slice(0, 10);
    expect(actualDate).toBe(expectedDate);
  });

  it("should return the list of videos after creation", async () => {
    const newVideo: VideoCreateModel = {
      title: "Video 1",
      author: "Author 1",
      availableResolutions: [Resolutions.P720],
    };

    await request(app).post(VIDEOS_PATH).send(newVideo);

    const res = await request(app).get(VIDEOS_PATH);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe(newVideo.title);
  });

  it("should return a video by id", async () => {
    const createdRes = await request(app)
      .post(VIDEOS_PATH)
      .send({
        title: "Video by id",
        author: "Author",
        availableResolutions: [Resolutions.P480],
      } satisfies VideoCreateModel);

    const createdId = createdRes.body.id;

    const res = await request(app).get(`${VIDEOS_PATH}/${createdId}`);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body.id).toBe(createdId);
    expect(res.body.title).toBe("Video by id");
  });

  it("should return 404 when requesting a non-existing video by id", async () => {
    const res = await request(app).get(`${VIDEOS_PATH}/999999`);

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it("should return 404 when requesting a video with an invalid (non-numeric) id", async () => {
    const res = await request(app).get(`${VIDEOS_PATH}/abc`);

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it("should update a video by id", async () => {
    const createdRes = await request(app)
      .post(VIDEOS_PATH)
      .send({
        title: "Old title",
        author: "Old author",
        availableResolutions: [Resolutions.P360],
      } satisfies VideoCreateModel);

    const createdId = createdRes.body.id;

    const updatePayload: VideoUpdateModel = {
      title: "New title",
      author: "New author",
      availableResolutions: [Resolutions.P1080, Resolutions.P1440],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: new Date().toISOString(),
    };

    const updateRes = await request(app).put(`${VIDEOS_PATH}/${createdId}`).send(updatePayload);

    expect(updateRes.status).toBe(HttpStatus.NoContent);

    const getRes = await request(app).get(`${VIDEOS_PATH}/${createdId}`);
    expect(getRes.body.title).toBe(updatePayload.title);
  });

  it("should return 404 when updating a non-existing video", async () => {
    const updatePayload: VideoUpdateModel = {
      title: "Title",
      author: "Author",
      availableResolutions: [Resolutions.P240],
      canBeDownloaded: false,
      minAgeRestriction: null,
      publicationDate: new Date().toISOString(),
    };

    const res = await request(app).put(`${VIDEOS_PATH}/999999`).send(updatePayload);

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it("should return 404 when id is not Number", async () => {
    const updatePayload: VideoUpdateModel = {
      title: "Title",
      author: "Author",
      availableResolutions: [Resolutions.P240],
      canBeDownloaded: false,
      minAgeRestriction: null,
      publicationDate: new Date().toISOString(),
    };

    const res = await request(app).put(`${VIDEOS_PATH}/abs`).send(updatePayload);

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it("should delete a video by id", async () => {
    const createdRes = await request(app)
      .post(VIDEOS_PATH)
      .send({
        title: "To be deleted",
        author: "Author",
        availableResolutions: [Resolutions.P144],
      } satisfies VideoCreateModel);

    const createdId = createdRes.body.id;

    const deleteRes = await request(app).delete(`${VIDEOS_PATH}/${createdId}`);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const getRes = await request(app).get(`${VIDEOS_PATH}/${createdId}`);
    expect(getRes.status).toBe(HttpStatus.NotFound);
  });

  it("should return 404 when deleting a non-existing video", async () => {
    const res = await request(app).delete(`${VIDEOS_PATH}/999999`);

    expect(res.status).toBe(HttpStatus.NotFound);
  });
});
