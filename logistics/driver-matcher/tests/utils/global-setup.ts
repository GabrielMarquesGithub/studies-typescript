import { execSync } from "node:child_process";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";

let container: StartedPostgreSqlContainer;

declare module "vitest" {
	export interface ProvidedContext {
		databaseUrl: string;
	}
}

export async function setup() {
	console.log("🔵 Iniciando container PostgreSQL...");

	container = await new PostgreSqlContainer("postgres:18.0-alpine3.22")
		.withDatabase("test_db")
		.withUsername("test_user")
		.withPassword("test_password")
		.start();

	const databaseUrl = container.getConnectionUri();

	console.log("🟢 Container PostgreSQL iniciado.");
	console.log("🔵 Executando migrations...");

	try {
		execSync("npx prisma migrate deploy", {
			env: { ...process.env, DB_URL: databaseUrl },
			stdio: "inherit"
		});

		console.log("🟢 Migrations executadas!");
	} catch (error) {
		await container.stop();
		console.log("🔴 Erro ao executar migrations.");
		throw error;
	}

	return async () => {
		if (!container) return;

		await container.stop();
		console.log("🟢 Container PostgreSQL parado.");
	};
}
