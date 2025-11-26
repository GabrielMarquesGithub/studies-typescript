import { env } from "@configs/env.js";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import { helloModule } from "@modules/hello";
import { handlersPlugin } from "@plugins/handlers";
import { prismaPlugin } from "@plugins/prisma";
import { swaggerPlugin } from "@plugins/swagger";
import type { FastifyTypedInstance } from "@types";
import Fastify, { type FastifyServerOptions } from "fastify";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";

type IBuildAppOptions = FastifyServerOptions & {
	skipDatabase?: boolean;
};

export function buildApp(options: IBuildAppOptions = {}): FastifyTypedInstance {
	const { skipDatabase, ...rest } = options;

	const app = Fastify({
		pluginTimeout: 35000,
		logger: {
			level: env.NODE_ENV === "dev" ? "debug" : "info",
			transport: env.NODE_ENV === "dev" ? { target: "pino-pretty" } : undefined
		},
		...rest
	}).withTypeProvider<ZodTypeProvider>();

	// --- Compiladores de validação ---
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// --- Plugins importados ---
	app.register(fastifyHelmet);
	app.register(fastifyRateLimit, {
		max: 100, // Máximo de 100 requests
		timeWindow: 1000 * 60 // Por minuto
	});

	// --- Plugins locais ---
	if (!skipDatabase) {
		app.register(prismaPlugin);
	}
	app.register(swaggerPlugin);

	// --- Handlers ---
	app.register(handlersPlugin);

	// --- Módulos ---
	app.register(helloModule, { prefix: "/api/v1" });

	return app;
}
