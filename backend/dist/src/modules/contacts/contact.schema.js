import { z } from "zod";
export const contactBodySchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    message: z.string().optional(),
    source: z.string().optional()
});
