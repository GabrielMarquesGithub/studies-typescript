import { buildApp } from "@app";
import { env } from "@configs/env.js";

let app: Awaited<ReturnType<typeof buildApp>>;

const start = async () => {
	try {
		app = buildApp();

		await app.listen({
			port: env.SERVER_PORT,
			host: env.SERVER_HOST
		});

		app.log.info("Rotas carregadas:");
		app.log.info(app.printRoutes({ commonPrefix: false }));
	} catch (error) {
		app?.log.error(error);
		process.exit(1);
	}
};

const shutdown = async (signal: NodeJS.Signals) => {
	console.log(`Recebido sinal ${signal}. Desligando elegantemente...`);

	if (!app) {
		console.log("🟡 Servidor não iniciado.");
		process.exit(0);
	}
	try {
		await app.close();
		console.log("🟢 Servidor desligado com sucesso.");
		process.exit(0);
	} catch (error) {
		console.error("🔴 Erro durante o desligamento: ", error);
		process.exit(1);
	}
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
