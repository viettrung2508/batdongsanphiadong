import { Router } from "express";

import { requireAdminAuth } from "../../middlewares/require-admin-auth.js";
import {
  createPostHandler,
  deletePostHandler,
  getPostDetail,
  listPosts,
  updatePostHandler
} from "./post.controller.js";

export const postRouter = Router();

postRouter.get("/", listPosts);
postRouter.get("/:slug", getPostDetail);
postRouter.post("/", requireAdminAuth, createPostHandler);
postRouter.patch("/:slug", requireAdminAuth, updatePostHandler);
postRouter.delete("/:slug", requireAdminAuth, deletePostHandler);
