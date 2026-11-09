import { defineConfig } from "vite-plus";
export default defineConfig({
  test: {
    reporters: "verbose",
    include: [
      // performance tests
      "test/performance.test.ts",
    ],
  },
});
