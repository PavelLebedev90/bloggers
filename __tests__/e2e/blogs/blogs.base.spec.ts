import request from "supertest";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { app } from "../../consts/express.const";
import {
  createBlog,
  createPostByBlogId,
  deleteBlogById,
  getBlogById,
  updateBlogById,
} from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { ObjectId } from "mongodb";
import { collectPostToCreate } from "../../utils/posts/collect-post-test.util";
import { createPost } from "../../utils/posts/crud-post-test.util";
import { BlogOutputModel } from "../../../src/modules/blogs/types/blogs-output.type";
import { BLOGS_ROUTER_PATH } from "../../../src/modules/blogs/const/blogs-router-path.const";

describe("Blogs CRUD", () => {
  setupDbLifecycle();

  it("should return an empty array when there are no blogs", async () => {
    const res = await request(app).get(BLOGS_ROUTER_PATH);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body.items).toEqual([]);
  });

  it("should create a new blog and return it", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);

    expect(blog.status).toBe(HttpStatus.Created);
    expect(blog.body).toEqual<BlogOutputModel>({
      id: expect.any(String),
      name: blog.body.name,
      description: blog.body.description,
      websiteUrl: blog.body.websiteUrl,
      createdAt: blog.body.createdAt,
      isMembership: blog.body.isMembership,
    });
  });

  it("should return the list of blogs after creation", async () => {
    await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
    const blog = await createBlog({ ...collectBlogToCreate(), name: "New" }).expect(
      HttpStatus.Created,
    );

    const res = await request(app).get(BLOGS_ROUTER_PATH);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body.items).toHaveLength(2);
    expect(blog.body.name).toBe("New");
  });

  it("should return a blog by id", async () => {
    const createdBlog = await createBlog({
      ...collectBlogToCreate(),
      name: "New",
      description: "description",
    }).expect(HttpStatus.Created);

    const createdId = createdBlog.body.id;

    const blog = await getBlogById(createdId).expect(HttpStatus.Ok);

    expect(blog.status).toBe(HttpStatus.Ok);
    expect(blog.body.id).toBe(createdId);
    expect(blog.body.name).toBe("New");
    expect(blog.body.description).toBe("description");
  });

  it("should return 404 when requesting a non-existing blog by id", async () => {
    const blog = await getBlogById(new ObjectId().toString());

    expect(blog.status).toBe(HttpStatus.NotFound);
  });

  it("should update a blog by id", async () => {
    const blog = await createBlog({
      ...collectBlogToCreate(),
      name: "Old name",
      description: "Old description",
    }).expect(HttpStatus.Created);

    const createdId = blog.body.id;

    const updateRes = await updateBlogById(createdId, {
      ...collectBlogToCreate(),
      name: "New name",
      description: "New description",
    });

    expect(updateRes.status).toBe(HttpStatus.NoContent);

    const getRes = await getBlogById(createdId);
    expect(getRes.body.id).toBe(createdId);
    expect(getRes.body.name).toBe("New name");
    expect(getRes.body.description).toBe("New description");
  });

  it("should return 404 when updating a non-existing blog", async () => {
    const updateRes = await updateBlogById(new ObjectId().toString(), collectBlogToCreate());

    expect(updateRes.status).toBe(HttpStatus.NotFound);
  });

  it("should delete a blog by id", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
    const createdId = blog.body.id;

    const deleteRes = await deleteBlogById(createdId);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const getRes = await getBlogById(createdId);
    expect(getRes.status).toBe(HttpStatus.NotFound);
  });

  it("should return 404 when deleting a non-existing blog", async () => {
    const deleteRes = await deleteBlogById(new ObjectId().toString());

    expect(deleteRes.status).toBe(HttpStatus.NotFound);
  });

  it("should create a post by blog id", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
    const postData = collectPostToCreate(blog.body.id);

    const res = await createPostByBlogId(blog.body.id, postData).expect(HttpStatus.Created);

    expect(res.status).toBe(HttpStatus.Created);
    expect(res.body).toEqual({
      id: expect.any(String),
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: blog.body.id,
      blogName: blog.body.name,
      createdAt: expect.any(String),
    });
  });

  it("should get posts by blog id", async () => {
    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
    const postData = collectPostToCreate(blog.body.id);
    await createPost(postData).expect(HttpStatus.Created);
    await createPost(postData).expect(HttpStatus.Created);
    await createPost(postData).expect(HttpStatus.Created);

    const res = await request(app).get(`${BLOGS_ROUTER_PATH}/${blog.body.id}/posts`);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body.items).toHaveLength(3);
    expect(res.body.items[0]).toMatchObject({
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: blog.body.id,
      blogName: blog.body.name,
    });
  });

  it("should return 404 for posts endpoints with a non-existing blog id", async () => {
    const blogId = new ObjectId().toString();

    await createPostByBlogId(blogId, collectPostToCreate(blogId)).expect(HttpStatus.NotFound);
    await request(app).get(`${BLOGS_ROUTER_PATH}/${blogId}/posts`).expect(HttpStatus.NotFound);
  });
});
