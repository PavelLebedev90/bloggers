import request from "supertest";
import { HttpStatus } from "@/core/types/http-statuses";
import { VideoCreateModel, VideoUpdateModel } from "@/routers/videos/types/video.input";
import { app, TESTING_PATH, VIDEOS_PATH } from "../../utils/config";
import { Resolutions } from "@/routers/videos/types/video.db";

const validCreatePayload: VideoCreateModel = {
  title: "Valid title",
  author: "Valid author",
  availableResolutions: [Resolutions.P1080],
};

const validUpdatePayload: VideoUpdateModel = {
  title: "Valid title",
  author: "Valid author",
  availableResolutions: [Resolutions.P1080],
  canBeDownloaded: true,
  minAgeRestriction: 18,
  publicationDate: new Date().toISOString(),
};

describe("videos validation", () => {
  beforeEach(async () => {
    await request(app).delete(`${TESTING_PATH}/all-data`);
  });

  describe("POST /videos", () => {
    it("should create a video when payload is valid", async () => {
      const res = await request(app).post(VIDEOS_PATH).send(validCreatePayload);

      expect(res.status).toBe(HttpStatus.Created);
    });

    it("should return 400 when title is missing", async () => {
      const { title, ...payload } = validCreatePayload;

      const res = await request(app).post(VIDEOS_PATH).send(payload);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );
    });

    it("should return 400 when title is not a string", async () => {
      const res = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validCreatePayload, title: 123 });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );
    });

    it("should return 400 when title exceeds maxLength (40)", async () => {
      const res = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validCreatePayload, title: "a".repeat(41) });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );
    });

    it("should return 400 when author is missing", async () => {
      const { author, ...payload } = validCreatePayload;

      const res = await request(app).post(VIDEOS_PATH).send(payload);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "author" })]),
      );
    });

    it("should return 400 when author exceeds maxLength (20)", async () => {
      const res = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validCreatePayload, author: "a".repeat(21) });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "author" })]),
      );
    });

    it("should return 400 when availableResolutions is missing", async () => {
      const { availableResolutions, ...payload } = validCreatePayload;

      const res = await request(app).post(VIDEOS_PATH).send(payload);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "availableResolutions" })]),
      );
    });

    it("should return 400 when availableResolutions is an empty array", async () => {
      const res = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validCreatePayload, availableResolutions: [] });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "availableResolutions" })]),
      );
    });

    it("should return 400 when availableResolutions contains an unknown resolution", async () => {
      const res = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validCreatePayload, availableResolutions: ["P9999"] });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "availableResolutions" })]),
      );
    });

    it("should not create a video when validation fails", async () => {
      await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validCreatePayload, title: "" });

      const res = await request(app).get(VIDEOS_PATH);
      expect(res.body).toEqual([]);
    });
  });

  describe("PUT /videos/:id", () => {
    const createVideo = async () => {
      const res = await request(app).post(VIDEOS_PATH).send(validCreatePayload);
      return res.body.id as number;
    };

    it("should update a video when payload is valid", async () => {
      const id = await createVideo();

      const res = await request(app).put(`${VIDEOS_PATH}/${id}`).send(validUpdatePayload);

      expect(res.status).toBe(HttpStatus.NoContent);
    });

    it("should return 400 when canBeDownloaded is missing", async () => {
      const id = await createVideo();
      const { canBeDownloaded, ...payload } = validUpdatePayload;

      const res = await request(app).put(`${VIDEOS_PATH}/${id}`).send(payload);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "canBeDownloaded" })]),
      );
    });

    it("should return 400 when canBeDownloaded is not a boolean", async () => {
      const id = await createVideo();

      const res = await request(app)
        .put(`${VIDEOS_PATH}/${id}`)
        .send({ ...validUpdatePayload, canBeDownloaded: "true" });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "canBeDownloaded" })]),
      );
    });

    it("should return 400 when minAgeRestriction is missing", async () => {
      const id = await createVideo();
      const { minAgeRestriction, ...payload } = validUpdatePayload;

      const res = await request(app).put(`${VIDEOS_PATH}/${id}`).send(payload);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "minAgeRestriction" })]),
      );
    });

    it("should return 204 when minAgeRestriction is null", async () => {
      const id = await createVideo();

      const res = await request(app)
        .put(`${VIDEOS_PATH}/${id}`)
        .send({ ...validUpdatePayload, minAgeRestriction: null });

      expect(res.status).toBe(HttpStatus.NoContent);
    });

    it("should return 400 when minAgeRestriction is below min (1)", async () => {
      const id = await createVideo();

      const res = await request(app)
        .put(`${VIDEOS_PATH}/${id}`)
        .send({ ...validUpdatePayload, minAgeRestriction: 0 });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "minAgeRestriction" })]),
      );
    });

    it("should return 400 when minAgeRestriction is above max (18)", async () => {
      const id = await createVideo();

      const res = await request(app)
        .put(`${VIDEOS_PATH}/${id}`)
        .send({ ...validUpdatePayload, minAgeRestriction: 19 });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "minAgeRestriction" })]),
      );
    });

    it("should return 400 when publicationDate is missing", async () => {
      const id = await createVideo();
      const { publicationDate, ...payload } = validUpdatePayload;

      const res = await request(app).put(`${VIDEOS_PATH}/${id}`).send(payload);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "publicationDate" })]),
      );
    });

    it("should return 400 (not update the video) when validation fails, even for an existing id", async () => {
      const id = await createVideo();

      await request(app)
        .put(`${VIDEOS_PATH}/${id}`)
        .send({ ...validUpdatePayload, title: "" });

      const res = await request(app).get(`${VIDEOS_PATH}/${id}`);
      expect(res.body.title).toBe(validCreatePayload.title);
    });
  });
});
