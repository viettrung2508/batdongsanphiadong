import { z } from "zod";

export const contactNotificationSettingsSchema = z.object({
  notificationEmail: z.string().email().or(z.literal("")).nullable().optional()
});

export type ContactNotificationSettingsInput = z.infer<typeof contactNotificationSettingsSchema>;
