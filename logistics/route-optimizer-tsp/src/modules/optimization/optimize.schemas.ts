import { z } from "zod";

const pointSchema = z.object({
	name: z.string("Nome deve ser uma string").nonempty("Nome é obrigatório"),
	x: z.number("Coordenada X deve ser um número"),
	y: z.number("Coordenada Y deve ser um número")
});

export const optimizeCoordinatesBodySchema = z.object({
	start: pointSchema,
	end: pointSchema,
	stops: z.array(pointSchema, "As paradas devem ser um array").nonempty("Adicione pelo menos 1 parada")
});

export const optimizeCoordinatesResponseSchema = z.array(pointSchema);

export type IOptimizeCoordinatesBody = z.infer<typeof optimizeCoordinatesBodySchema>;
export type IPoint = z.infer<typeof pointSchema>;

export const roadConditionSchema = z.enum(
	["GOOD", "REGULAR", "BAD"],
	"A condição da estrada inválida deve: GOOD, REGULAR ou BAD"
);

export const graphEdgeSchema = z.object({
	from: z.string("'De' deve ser uma string").nonempty("O campo 'de' é obrigatório"),
	to: z.string("'Para' deve ser uma string").nonempty("O campo 'para' é obrigatório"),
	distance: z.number("Distancia deve ser um número").positive("A distância deve ser positiva"),
	roadCondition: roadConditionSchema
});

export const optimizeNetworkBodySchema = z.object({
	startNodeId: z.string("O identificador de inicio deve ser uma string").nonempty("O campo de inicio é obrigatório"),
	endNodeId: z.string("O identificador de chegada deve ser uma string").nonempty("O campo de chegada é obrigatório"),
	stopsNodeIds: z.array(z.string(), "As paradas devem ser um array").nonempty("Adicione pelo menos 1 parada"),
	edges: z.array(graphEdgeSchema).min(1, "As cidades devem conter ao menos 1 conexão")
});

export const optimizeNetworkResponseSchema = z.object({
	route: z.array(z.string()),
	distance: z.number()
});

export type IRoadCondition = z.infer<typeof roadConditionSchema>;
export type IGraphEdge = z.infer<typeof graphEdgeSchema>;
export type IOptimizeNetworkBody = z.infer<typeof optimizeNetworkBodySchema>;
export type IOptimizeNetworkResponse = z.infer<typeof optimizeNetworkResponseSchema>;
