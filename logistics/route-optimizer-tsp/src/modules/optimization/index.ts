import { optimizeRoutes } from "@modules/optimization/optimize.routes";
import { TSPService } from "@modules/optimization/tsp.service";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		tspService: TSPService;
	}
}

export const optimizationModule: FastifyPluginAsync = fp(async (app) => {
	const tspService = new TSPService();
	app.decorate("tspService", tspService);

	app.register(optimizeRoutes);
});
