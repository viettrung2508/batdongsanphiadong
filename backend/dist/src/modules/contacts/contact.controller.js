import { ZodError } from "zod";
import { contactNotificationSettingsSchema } from "./contact-notification.schema.js";
import { createContact, deleteContact, getContactList, getContactNotificationEmail, updateContactNotificationEmail } from "./contact.service.js";
import { contactBodySchema } from "./contact.schema.js";
function getIdParam(request) {
    return Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
}
export async function listContacts(_request, response) {
    const items = await getContactList();
    response.json({
        items
    });
}
export async function getContactSettingsHandler(_request, response) {
    const notificationEmail = await getContactNotificationEmail();
    response.json({
        notificationEmail
    });
}
export async function updateContactSettingsHandler(request, response) {
    try {
        const input = contactNotificationSettingsSchema.parse(request.body);
        const notificationEmail = await updateContactNotificationEmail(input.notificationEmail?.trim() || null);
        response.json({
            notificationEmail
        });
    }
    catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json({
                message: "Dữ liệu không hợp lệ",
                issues: error.flatten()
            });
        }
        throw error;
    }
}
export async function createContactHandler(request, response) {
    try {
        const input = contactBodySchema.parse(request.body);
        const item = await createContact(input);
        response.status(201).json(item);
    }
    catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json({
                message: "Dữ liệu không hợp lệ",
                issues: error.flatten()
            });
        }
        throw error;
    }
}
export async function deleteContactHandler(request, response) {
    const deleted = await deleteContact(getIdParam(request));
    if (!deleted) {
        return response.status(404).json({
            message: "Không tìm thấy liên hệ"
        });
    }
    response.status(204).send();
}
