import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/cli.ts"],
  project: ["src/**/*.ts"],
  ignore: [
    "tests/integration/cli/node-js.test.ts", // Uses $`node ${cliPath}` syntax which knip misinterprets
  ],
  ignoreDependencies: ["tslib", "@commitlint/cli"],
  ignoreBinaries: ["du", "awk", "goreleaser", "gh"], // du,awk: deps:size script, goreleaser: build scripts, gh: release scripts
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
  // Ignore unused exports for backward compatibility
  exclude: ["exports", "types"],
};

export default config;
