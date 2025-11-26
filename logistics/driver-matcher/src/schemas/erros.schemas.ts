import { z } from "zod";

const validationErrorSchema = z.object({
	field: z.string(),
	message: z.string()
});

export const httpErrorSchema = z.object({
	statusCode: z.number().int().min(400).max(599),
	error: z.string().min(1),
	message: z.string().min(1),
	details: z.array(validationErrorSchema).optional()
});

export type IHttpError = z.infer<typeof httpErrorSchema>;
