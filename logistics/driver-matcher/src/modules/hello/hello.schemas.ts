import { z } from "zod";

export const helloResponseSchema = z.object({
	message: z.string()
});
