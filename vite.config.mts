import { typescriptLintPreset } from "@toruslabs/oxlint-config-typescript";
import { formatPreset } from "@toruslabs/torus-scripts/fmt";
import { libraryPreset } from "@toruslabs/torus-scripts/library";
import { defineConfig } from "vite-plus";

const library = libraryPreset({ entry: "src/index.ts", format: ["esm", "cjs"] });
const lint = typescriptLintPreset();

const browserBundle = {
  format: "iife" as const,
  globalName: "BroadcastChannel",
  platform: "browser" as const,
  target: "es2020",
  outDir: "dist/lib",
  dts: false,
  clean: false,
  deps: { alwaysBundle: [/.*/], onlyBundle: false as const },
  outputOptions: { entryFileNames: "[name].js" },
};

const generatedDemoBundles = ["docs/*.js"];
const unformattedFiles = ["docs/*.html", "test/scripts/**", "CHANGELOG.md", "README.md", ".github/ISSUE_TEMPLATE.md", ".github/README.md"];

export default defineConfig({
  pack: [
    {
      ...library.pack,
      format: {
        esm: { outDir: "dist/lib.esm" },
        cjs: { outDir: "dist/lib.cjs" },
      },
      outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
      clean: ["dist"],
    },
    { ...browserBundle, entry: { browser: "src/index.ts" } },
    { ...browserBundle, entry: { "browser.min": "src/index.ts" }, minify: true },
  ],
  fmt: { ...formatPreset(), ignorePatterns: [...generatedDemoBundles, ...unformattedFiles] },
  lint: {
    ...lint,
    ignorePatterns: [...(lint.ignorePatterns ?? []), ...generatedDemoBundles],
    rules: { ...lint.rules, "tsdoc/syntax": "off" },
    overrides: [...(lint.overrides ?? []), { files: ["test/**"], rules: { "no-console": "off" } }],
  },
});
