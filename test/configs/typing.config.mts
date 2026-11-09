import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    reporters: "verbose",
    include: [
      // typings tests
      "test/typings.test.ts",
    ],
  },
});
