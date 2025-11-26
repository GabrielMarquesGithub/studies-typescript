import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: "node",
		fileParallelism: true,
		coverage: {
			provider: "v8",
			enabled: true
		}
	}
});
