import { env } from "@configs/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const prismaPluginAsync: FastifyPluginAsync = async (app) => {
	const adapter = new PrismaPg({
		connectionString: env.DB_URL
	});
	const prisma = new PrismaClient({ adapter });

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			await prisma.$connect();
			app.log.info(`[Plugin] Prisma conectado com sucesso na tentativa ${attempt}.`);
			break;
		} catch (error) {
			app.log.warn(`[Plugin] Falha ao conectar ao Prisma (Tentativa ${attempt}/${MAX_RETRIES}). Tentando novamente...`);

			if (attempt === MAX_RETRIES) {
				app.log.error(error, "[Plugin] Não foi possível conectar ao banco de dados após todas as tentativas.");

				throw new Error("Falha ao conectar ao banco de dados após múltiplas tentativas.");
			}

			const delay = INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1);
			await sleep(delay);
		}
	}

	app.decorate("prisma", prisma);

	app.addHook("onClose", async (instance) => {
		await instance.prisma.$disconnect();
		app.log.info("[Plugin] Prisma desconectado.");
	});
};

export const prismaPlugin = fp(prismaPluginAsync, { name: "prisma" });
