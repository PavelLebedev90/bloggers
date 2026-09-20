import { nanoid } from "nanoid";
import { db } from "../../../db/db-bloggers";
import { BlogDBModel } from "../../blogs/types/blogs-db.type";
import { PostCreateModel, PostUpdateModel } from "../types/posts-input.type";
import { postsToOutputMapper, postToOutputMapper } from "../mappers/post-to-output.mapper";
import { postToDBMapper } from "../mappers/post-to-db.mapper";

export const postsRepository = {
  getAll() {
    return postsToOutputMapper(db.posts);
  },
  getPost(postId: string) {
    const post = db.posts.find((post) => post.id === postId) ?? null;
    if (post) {
      return postToOutputMapper(post);
    }
    return post;
  },
  createPost(bodyPost: PostCreateModel, blog: BlogDBModel) {
    const id = nanoid(10);

    const newPost = postToDBMapper(id, bodyPost, blog);
    db.posts.push(newPost);
    return postToOutputMapper(newPost);
  },
  updatePost(postId: string, bodyPost: PostUpdateModel, blog: BlogDBModel) {
    const dbPost = db.posts.find((post) => post.id === postId);
    if (!dbPost) {
      return false;
    }

    dbPost.title = bodyPost.title;
    dbPost.shortDescription = bodyPost.shortDescription;
    dbPost.content = bodyPost.content;
    dbPost.blogId = blog.id;

    return true;
  },
  deletePost(postId: string) {
    const postIdx = db.posts.findIndex((post) => post.id === postId);

    if (postIdx === -1) {
      return false;
    }
    db.posts.splice(postIdx, 1);
    return true;
  },
};
