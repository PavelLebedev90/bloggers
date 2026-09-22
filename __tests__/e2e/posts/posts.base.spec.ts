import request from "supertest";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { app } from "../../consts/express.const";
import { POSTS_ROUTER_PATH } from "../../../src/routers/posts/const/posts-router-path.const";
import { PostResponseModel } from "../../../src/routers/posts/types/posts-output.type";
import { createBlog } from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";
import { collectPostToCreate } from "../../utils/posts/collect-post-test.util";
import {
  createPost,
  deletePostById,
  getPostById,
  updatePostById,
} from "../../utils/posts/crud-post-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

describe("Posts CRUD", () => {
  setupDbLifecycle();

  it("should return an empty array when there are no posts", async () => {
    const res = await request(app).get(POSTS_ROUTER_PATH);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body).toEqual([]);
  });

  it("should create a new post and return it", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);

    const post = await createPost(collectPostToCreate(blog.body.id)).expect(HttpStatus.Created);

    expect(post.status).toBe(HttpStatus.Created);
    expect(post.body).toEqual<PostResponseModel>({
      id: expect.any(String),
      title: post.body.title,
      blogId: blog.body.id,
      blogName: blog.body.name,
      content: post.body.content,
      shortDescription: post.body.shortDescription,
    });
  });

  it("should return the list of posts after creation", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);

    await createPost(collectPostToCreate(blog.body.id)).expect(HttpStatus.Created);
    await createPost({ ...collectPostToCreate(blog.body.id), title: "New" }).expect(
      HttpStatus.Created,
    );

    const res = await request(app).get(POSTS_ROUTER_PATH);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body).toHaveLength(2);
    expect(res.body[1].title).toBe("New");
  });

  it("should return a post by id", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);

    const createdPost = await createPost({
      ...collectPostToCreate(blog.body.id),
      title: "New",
      shortDescription: "shortDescription",
    }).expect(HttpStatus.Created);

    const createdId = createdPost.body.id;

    const post = await getPostById(createdId).expect(HttpStatus.Ok);

    expect(post.status).toBe(HttpStatus.Ok);
    expect(post.body.id).toBe(createdId);
    expect(post.body.title).toBe("New");
    expect(post.body.shortDescription).toBe("shortDescription");
  });

  it("should return 404 when requesting a non-existing post by id", async () => {
    const post = await getPostById("99999");

    expect(post.status).toBe(HttpStatus.NotFound);
  });
  it("should return 404 when requesting a non-existing blog by blogId", async () => {
    const createdPost = await createPost(collectPostToCreate("999"));
    expect(createdPost.status).toBe(HttpStatus.NotFound);
  });

  it("should update a post by id", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);

    const post = await createPost({
      ...collectPostToCreate(blog.body.id),
      title: "Old title",
      content: "Old content",
    }).expect(HttpStatus.Created);

    const createdId = post.body.id;

    const updateRes = await updatePostById(createdId, {
      ...collectPostToCreate(blog.body.id),
      title: "New title",
      content: "New content",
    });

    expect(updateRes.status).toBe(HttpStatus.NoContent);

    const getRes = await getPostById(createdId);
    expect(getRes.body.id).toBe(createdId);
    expect(getRes.body.title).toBe("New title");
    expect(getRes.body.content).toBe("New content");
  });

  it("should return 404 when updating a non-existing post", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);

    const updateRes = await updatePostById("9999", collectPostToCreate(blog.body.id));

    expect(updateRes.status).toBe(HttpStatus.NotFound);
  });
  it("should return 404 when updating a non-existing  blogId", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
    const post = await createPost(collectPostToCreate(blog.body.id)).expect(HttpStatus.Created);

    const updateRes = await updatePostById(post.body.id, collectPostToCreate("9999"));

    expect(updateRes.status).toBe(HttpStatus.NotFound);
  });

  it("should delete a post by id", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
    const post = await createPost(collectPostToCreate(blog.body.id)).expect(HttpStatus.Created);
    const createdId = post.body.id;

    const deleteRes = await deletePostById(createdId);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const getRes = await getPostById(createdId);
    expect(getRes.status).toBe(HttpStatus.NotFound);
  });

  it("should return 404 when deleting a non-existing post", async () => {
    const deleteRes = await deletePostById("9999");

    expect(deleteRes.status).toBe(HttpStatus.NotFound);
  });
});
