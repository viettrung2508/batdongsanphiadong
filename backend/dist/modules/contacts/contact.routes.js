import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth.js";
import { createContactHandler, listContacts } from "./contact.controller.js";
export const contactRouter = Router();
contactRouter.get("/", requireAdminAuth, listContacts);
contactRouter.post("/", createContactHandler);
