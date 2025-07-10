import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.ts", "tests/**/*.ts"],
  ignore: ["bin/**", "tests/integration/node-js.test.ts"],
  ignoreDependencies: ["tslib"],
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
};

export default config;
