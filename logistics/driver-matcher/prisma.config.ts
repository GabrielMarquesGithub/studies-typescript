import path from "node:path";
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	datasource: {
		url: env("DB_URL")
	},
	schema: path.join("src", "prisma", "schemas"),
	migrations: {
		path: path.join("src", "prisma", "migrations")
	}
});
