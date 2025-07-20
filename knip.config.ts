import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/presentation/cli.ts"],
  project: ["src/**/*.ts"],
  ignore: [
    "src/presentation/index.ts", // Package entry point (main field in package.json) - exports are used by npm package consumers
    "tests/integration/cli/node-js.test.ts", // Uses $`node ${cliPath}` syntax which knip misinterprets
  ],
  ignoreDependencies: ["tslib", "@commitlint/cli"],
  ignoreBinaries: ["du", "awk", "goreleaser", "gh"], // du,awk: deps:size script, goreleaser: build scripts, gh: release scripts
  ignoreExportsUsedInFile: false,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
};

export default config;
