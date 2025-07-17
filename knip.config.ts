import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.ts", "tests/**/*.ts"],
  ignore: [
    "tests/integration/cli/node-js.test.ts", // Uses $`node ${cliPath}` syntax which knip misinterprets
  ],
  ignoreDependencies: ["tslib", "@commitlint/cli"],
  ignoreBinaries: ["du", "awk", "goreleaser", "gh", "jq"], // du,awk: deps:size script, goreleaser: build scripts, gh: release scripts, jq: trigger:homebrew
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
};

export default config;
