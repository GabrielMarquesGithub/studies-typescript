import { helloRoutes } from "@modules/hello/hello.routes";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

export const helloModule: FastifyPluginAsync = fp(async (app) => {
	app.register(helloRoutes);
});
