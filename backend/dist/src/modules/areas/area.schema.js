import { z } from "zod";
export const areaBodySchema = z.object({
    name: z.string().trim().min(1),
    slug: z.string().trim().min(1),
    description: z.string().trim().optional()
});
