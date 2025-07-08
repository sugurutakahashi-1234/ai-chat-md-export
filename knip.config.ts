import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.ts", "tests/**/*.ts"],
  ignore: ["bin/**"],
  ignoreDependencies: ["tslib"],
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
};

export default config;
