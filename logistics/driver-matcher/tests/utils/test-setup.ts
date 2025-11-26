import { buildApp } from "@app";
import type { FastifyTypedInstance } from "@types";

export async function createTestApp() {
	const app = buildApp({ logger: false });
	await app.ready();
	return app;
}

export async function closeTestApp(app: FastifyTypedInstance) {
	await app.close();
}
