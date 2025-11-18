import type { FastifyError, FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";

const handlersPluginAsync: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.addHook("onRequest", async (request) => {
		app.log.debug(`[${request.method}] ${request.raw.url}`);
	});

	app.setErrorHandler((error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
		let statusCode = error.statusCode || 500;
		let message = error.message;

		if (hasZodFastifySchemaValidationErrors(error)) {
			statusCode = 400;
			message = "Erro de validação dos dados fornecidos";
		}

		if (isResponseSerializationError(error)) {
			statusCode = 500;
			message = "Erro ao serializar a resposta do servidor";
		}

		if (statusCode >= 500) {
			app.log.error(error, error.message);
		}

		return reply.status(statusCode).send({
			success: false,
			message: message,
			error: error.name,
			statusCode: statusCode
		});
	});

	app.setNotFoundHandler((request, reply) => {
		reply.status(404).send({
			success: false,
			message: `Rota não encontrada: [${request.method}] ${request.url}`,
			error: "NotFound",
			statusCode: 404
		});
	});
};

export const handlersPlugin = fp(handlersPluginAsync);
