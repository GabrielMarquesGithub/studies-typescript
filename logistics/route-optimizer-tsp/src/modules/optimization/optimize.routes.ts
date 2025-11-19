import { optimizeBodySchema, optimizeResponseSchema } from "@modules/optimization/optimize.schemas";
import type { FastifyTypedInstance } from "@types";
import type { FastifyPluginAsync } from "fastify";

export const optimizeRoutes: FastifyPluginAsync = async (app: FastifyTypedInstance) => {
	app.post(
		"/optimize",
		{
			schema: {
				operationId: "optimizeRoute",
				tags: ["Rotas"],
				summary: "Calcula a rota otimizada",
				body: optimizeBodySchema,
				response: { 200: optimizeResponseSchema }
			}
		},
		async (request, reply) => {
			const { start, end, stops } = request.body;

			// O Controller delega a lógica ao Service injetado
			const optimizedRoute = app.tspService.optimizeRoute(start, end, stops);

			return reply.status(200).send(optimizedRoute);
		}
	);
};
