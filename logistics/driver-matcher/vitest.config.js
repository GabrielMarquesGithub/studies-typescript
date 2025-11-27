import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: "node",
		fileParallelism: false,
		coverage: {
			provider: "v8",
			enabled: true
		},
		include: ["tests/**/*.test.ts"],
		globals: true,
		globalSetup: ["tests/utils/global-setup.ts"]
	}
});
