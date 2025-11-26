import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

const swaggerPluginAsync: FastifyPluginAsync = async (app) => {
	app.register(fastifySwagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "API",
				description: "Documentação da API",
				version: "1.0.0"
			}
		},
		transform: jsonSchemaTransform
	});
	app.register(fastifySwaggerUI, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "list",
			deepLinking: true
			//persistAuthorization: env.NODE_ENV === "dev"
		}
	});
};

export const swaggerPlugin = fp(swaggerPluginAsync, { name: "swagger" });
