import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [],
  project: ["src/**/*.ts"],
  ignore: [
    "src/presentation/index.ts", // Package entry point (main field in package.json) - exports are used by npm package consumers
    "src/__tests__/integration/cli-node-compatibility.test.ts", // Uses $`node ${cliPath}` syntax which knip misinterprets
  ],
  ignoreDependencies: ["tslib", "@commitlint/cli"], // tslib is a runtime dependency, @commitlint/cli is used in CI only
  ignoreBinaries: ["du", "awk", "sed", "goreleaser", "gh"], // du,awk,sed: deps:size script, goreleaser: build scripts, gh: release scripts
  ignoreExportsUsedInFile: false,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
};

export default config;
