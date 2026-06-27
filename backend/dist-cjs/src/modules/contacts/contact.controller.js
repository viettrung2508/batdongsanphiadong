"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContacts = listContacts;
exports.getContactSettingsHandler = getContactSettingsHandler;
exports.updateContactSettingsHandler = updateContactSettingsHandler;
exports.createContactHandler = createContactHandler;
exports.deleteContactHandler = deleteContactHandler;
const zod_1 = require("zod");
const contact_notification_schema_js_1 = require("./contact-notification.schema.js");
const contact_service_js_1 = require("./contact.service.js");
const contact_schema_js_1 = require("./contact.schema.js");
function getIdParam(request) {
    return Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
}
async function listContacts(_request, response) {
    const items = await (0, contact_service_js_1.getContactList)();
    response.json({
        items
    });
}
async function getContactSettingsHandler(_request, response) {
    const notificationEmail = await (0, contact_service_js_1.getContactNotificationEmail)();
    response.json({
        notificationEmail
    });
}
async function updateContactSettingsHandler(request, response) {
    try {
        const input = contact_notification_schema_js_1.contactNotificationSettingsSchema.parse(request.body);
        const notificationEmail = await (0, contact_service_js_1.updateContactNotificationEmail)(input.notificationEmail?.trim() || null);
        response.json({
            notificationEmail
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return response.status(400).json({
                message: "Dữ liệu không hợp lệ",
                issues: error.flatten()
            });
        }
        throw error;
    }
}
async function createContactHandler(request, response) {
    try {
        const input = contact_schema_js_1.contactBodySchema.parse(request.body);
        const item = await (0, contact_service_js_1.createContact)(input);
        response.status(201).json(item);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return response.status(400).json({
                message: "Dữ liệu không hợp lệ",
                issues: error.flatten()
            });
        }
        throw error;
    }
}
async function deleteContactHandler(request, response) {
    const deleted = await (0, contact_service_js_1.deleteContact)(getIdParam(request));
    if (!deleted) {
        return response.status(404).json({
            message: "Không tìm thấy liên hệ"
        });
    }
    response.status(204).send();
}
