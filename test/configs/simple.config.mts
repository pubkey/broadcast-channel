import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    reporters: "verbose",
    include: [
      // simple tests
      "test/simple.test.ts",
    ],
  },
});
