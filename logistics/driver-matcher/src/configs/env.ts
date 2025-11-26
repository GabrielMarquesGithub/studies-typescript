import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["dev", "prod", "test"], "NODE_ENV deve ser 'dev', 'test' ou 'prod'"),
	SERVER_PORT: z.coerce.number("SERVER_PORT deve ser um número"),
	SERVER_HOST: z.string("SERVER_HOST é inválido").nonempty("SERVER_HOST é obrigatório")
});

let env: z.infer<typeof envSchema>;

try {
	env = envSchema.parse(process.env);
} catch (error) {
	console.error("🔴 Erro de validação nas variáveis de ambiente: ", error);
	process.exit(1);
}

export { env };
