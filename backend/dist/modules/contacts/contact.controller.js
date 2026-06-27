import { ZodError } from "zod";
import { createContact, getContactList } from "./contact.service.js";
import { contactBodySchema } from "./contact.schema.js";
export async function listContacts(_request, response) {
    const items = await getContactList();
    response.json({
        items
    });
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
