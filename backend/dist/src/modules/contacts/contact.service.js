import { prisma } from "../../lib/prisma.js";
import { CONTACT_NOTIFICATION_EMAIL_KEY } from "./contact.constants.js";
import { sendContactNotificationEmail } from "./contact-mailer.service.js";
export async function getContactList() {
    return prisma.contactSubmission.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
}
export async function getContactNotificationEmail() {
    const setting = await prisma.appSetting.findUnique({
        where: {
            key: CONTACT_NOTIFICATION_EMAIL_KEY
        }
    });
    return setting?.value ?? null;
}
export async function updateContactNotificationEmail(value) {
    const setting = await prisma.appSetting.upsert({
        where: {
            key: CONTACT_NOTIFICATION_EMAIL_KEY
        },
        update: {
            value
        },
        create: {
            key: CONTACT_NOTIFICATION_EMAIL_KEY,
            value
        }
    });
    return setting.value ?? null;
}
export async function createContact(input) {
    const item = await prisma.contactSubmission.create({
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
        await sendContactNotificationEmail(notificationEmail, {
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
export async function deleteContact(id) {
    const item = await prisma.contactSubmission.findUnique({
        where: {
            id
        }
    });
    if (!item) {
        return null;
    }
    await prisma.contactSubmission.delete({
        where: {
            id
        }
    });
    console.info("[contact] deleted", {
        contactId: id
    });
    return item;
}
