import {
	optimizeCoordinatesBodySchema,
	optimizeCoordinatesResponseSchema,
	optimizeNetworkBodySchema,
	optimizeNetworkResponseSchema
} from "@modules/optimization/optimize.schemas";
import type { FastifyTypedInstance } from "@types";
import type { FastifyPluginAsync } from "fastify";

export const optimizeRoutes: FastifyPluginAsync = async (app: FastifyTypedInstance) => {
	app.post(
		"/coordinates",
		{
			schema: {
				operationId: "optimizeCoordinates",
				tags: ["Logística"],
				summary: "Otimiza a rota entre pontos considerando apenas coordenadas",
				description: "Usa uma heurística simples para otimizar a ordem das paradas intermediárias.",
				body: optimizeCoordinatesBodySchema,
				response: { 200: optimizeCoordinatesResponseSchema }
			}
		},
		async (request, reply) => {
			const input = request.body;

			// O Controller delega a lógica ao Service injetado
			const optimizedRoute = app.tspService.optimizeCoordinates(input);

			return reply.status(200).send(optimizedRoute);
		}
	);

	app.post(
		"/network",
		{
			schema: {
				tags: ["Logística"],
				summary: "Otimiza rota considerando estradas e condições",
				description: "Usa Dijkstra para calcular o custo real entre nós considerando o estado da via.",
				body: optimizeNetworkBodySchema,
				response: { 200: optimizeNetworkResponseSchema }
			}
		},
		async (request, reply) => {
			const input = request.body;

			const result = app.tspService.optimizeNetwork(input);
			return reply.send(result);
		}
	);
};
