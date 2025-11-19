import { z } from "zod";

const pointSchema = z.object({
	name: z.string("Nome deve ser uma string").nonempty("Nome é obrigatório"),
	x: z.number("Coordenada X deve ser um número"),
	y: z.number("Coordenada Y deve ser um número")
});

export const optimizeBodySchema = z.object({
	start: pointSchema,
	end: pointSchema,
	stops: z.array(pointSchema, "As paradas devem ser um array").nonempty("Adicione pelo menos 1 parada")
});

export const optimizeResponseSchema = z.array(pointSchema);

export type IOptimizeBody = z.infer<typeof optimizeBodySchema>;
export type IPoint = z.infer<typeof pointSchema>;
