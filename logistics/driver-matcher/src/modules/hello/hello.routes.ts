import { helloResponseSchema } from "@modules/hello/hello.schemas";
import { httpErrorSchema } from "@schemas/erros.schemas";
import type { FastifyTypedInstance } from "@types";
import type { FastifyPluginAsync } from "fastify";

export const helloRoutes: FastifyPluginAsync = async (app: FastifyTypedInstance) => {
	app.get(
		"/",
		{
			schema: {
				operationId: "getHello",
				tags: ["Hello"],
				summary: "Retorna uma mensagem de saudação",
				description: "Endpoint para retornar uma mensagem de saudação simples.",
				response: { 200: helloResponseSchema, 500: httpErrorSchema }
			}
		},
		async (_request, reply) => {
			return reply.status(200).send({ message: "Hello, World!" });
		}
	);
};
