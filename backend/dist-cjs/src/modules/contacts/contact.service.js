"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactList = getContactList;
exports.getContactNotificationEmail = getContactNotificationEmail;
exports.updateContactNotificationEmail = updateContactNotificationEmail;
exports.createContact = createContact;
exports.deleteContact = deleteContact;
const prisma_js_1 = require("../../lib/prisma.js");
const contact_constants_js_1 = require("./contact.constants.js");
const contact_mailer_service_js_1 = require("./contact-mailer.service.js");
async function getContactList() {
    return prisma_js_1.prisma.contactSubmission.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
}
async function getContactNotificationEmail() {
    const setting = await prisma_js_1.prisma.appSetting.findUnique({
        where: {
            key: contact_constants_js_1.CONTACT_NOTIFICATION_EMAIL_KEY
        }
    });
    return setting?.value ?? null;
}
async function updateContactNotificationEmail(value) {
    const setting = await prisma_js_1.prisma.appSetting.upsert({
        where: {
            key: contact_constants_js_1.CONTACT_NOTIFICATION_EMAIL_KEY
        },
        update: {
            value
        },
        create: {
            key: contact_constants_js_1.CONTACT_NOTIFICATION_EMAIL_KEY,
            value
        }
    });
    return setting.value ?? null;
}
async function createContact(input) {
    const item = await prisma_js_1.prisma.contactSubmission.create({
        data: {
            name: input.name,
            phone: input.phone,
            email: input.email || null,
            message: input.message,
            source: input.source
        }
    });
    console.info("[contact] created", {
        contactId: item.id,
        source: item.source ?? "website",
        hasEmail: Boolean(item.email),
        hasMessage: Boolean(item.message)
    });
    try {
        const notificationEmail = await getContactNotificationEmail();
        console.info("[contact] notification target loaded", {
            contactId: item.id,
            hasNotificationEmail: Boolean(notificationEmail),
            notificationEmail: notificationEmail ?? null
        });
        await (0, contact_mailer_service_js_1.sendContactNotificationEmail)(notificationEmail, {
            id: item.id,
            createdAt: item.createdAt,
            name: item.name,
            phone: item.phone,
            email: item.email,
            message: item.message,
            source: item.source
        });
    }
    catch (error) {
        console.error("[contact] failed to send notification email", {
            contactId: item.id,
            error
        });
    }
    return item;
}
async function deleteContact(id) {
    const item = await prisma_js_1.prisma.contactSubmission.findUnique({
        where: {
            id
        }
    });
    if (!item) {
        return null;
    }
    await prisma_js_1.prisma.contactSubmission.delete({
        where: {
            id
        }
    });
    console.info("[contact] deleted", {
        contactId: id
    });
    return item;
}
