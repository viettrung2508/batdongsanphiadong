import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth.js";
import { createContactHandler, deleteContactHandler, getContactSettingsHandler, listContacts, updateContactSettingsHandler } from "./contact.controller.js";
export const contactRouter = Router();
contactRouter.get("/settings", requireAdminAuth, getContactSettingsHandler);
contactRouter.patch("/settings", requireAdminAuth, updateContactSettingsHandler);
contactRouter.get("/", requireAdminAuth, listContacts);
contactRouter.delete("/:id", requireAdminAuth, deleteContactHandler);
contactRouter.post("/", createContactHandler);
