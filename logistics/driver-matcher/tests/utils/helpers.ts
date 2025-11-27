import { buildApp } from "@app";
import type { FastifyTypedInstance } from "@types";

export async function createTestApp(): Promise<FastifyTypedInstance> {
	const app = buildApp({
		logger: false
	});

	await app.ready();
	return app;
}

export async function closeTestApp(app: FastifyTypedInstance): Promise<void> {
	await app.close();
}

export async function cleanDatabase(app: FastifyTypedInstance): Promise<void> {
	const tablenames = await app.prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;

	const tables = tablenames
		.map(({ tablename }) => tablename)
		.filter((name) => name !== "_prisma_migrations")
		.map((name) => `"public"."${name}"`)
		.join(", ");

	if (tables.length > 0) {
		await app.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
	}
}
