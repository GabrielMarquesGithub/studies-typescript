import type { IHttpError } from "@schemas/erros.schemas";
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
		let details: IHttpError["details"];

		if (hasZodFastifySchemaValidationErrors(error)) {
			statusCode = 400;
			message = "Erro de validação";
			details = error.validation?.map((issue) => ({
				field: issue.instancePath.replace("/", ""),
				message: issue.message || "Erro de validação desconhecido"
			}));
		}

		if (isResponseSerializationError(error)) {
			statusCode = 500;
			message = "Erro ao serializar a resposta do servidor";
		}

		if (statusCode >= 500) {
			app.log.error(error, error.message);
		}

		const response: IHttpError = {
			statusCode,
			error: error.name,
			message
		};

		if (details) {
			response.details = details;
		}

		return reply.status(statusCode).send(response);
	});

	app.setNotFoundHandler((request, reply) => {
		reply.status(404).send({
			statusCode: 404,
			error: "NotFound",
			message: `Rota não encontrada: [${request.method}] ${request.url}`
		});
	});
};

export const handlersPlugin = fp(handlersPluginAsync);
