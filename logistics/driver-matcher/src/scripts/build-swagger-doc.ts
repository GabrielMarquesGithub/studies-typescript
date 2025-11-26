import fs from "node:fs/promises";
import path from "node:path";
import { buildApp } from "@app";

async function buildSwaggerDoc() {
	console.log("🔵 Gerando especificação OpenAPI...");

	const app = buildApp({
		logger: false
	});

	await app.ready();

	const spec = app.swagger();

	const specJson = JSON.stringify(spec, null, 2);

	// Garantir que o diretório 'docs' exista na raiz do projeto
	const docsDir = path.resolve(__dirname, "..", "..", "docs");
	await fs.mkdir(docsDir, { recursive: true });

	const outputPath = path.join(docsDir, "api.json");
	await fs.writeFile(outputPath, specJson, "utf-8");

	console.log(`🟢 Especificação OpenAPI salva em: ${outputPath}`);

	await app.close();
}

buildSwaggerDoc().catch((err: Error) => {
	console.error("🔴 Erro ao gerar Swagger: ", err);
	process.exit(1);
});
