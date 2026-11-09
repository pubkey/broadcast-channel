import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    reporters: "verbose",
    coverage: {
      reporter: ["text"],
      provider: "istanbul",
      include: ["src/**/*.ts"],
    },
    include: [
      // integration tests
      "test/integration.test.ts",

      // issues tests
      "test/issues.test.ts",

      // unit tests
      "test/unit/custom.method.test.ts",
      "test/unit/options.test.ts",
    ],
    environment: "node",
  },
});
