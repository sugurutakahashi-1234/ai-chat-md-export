import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.ts", "tests/**/*.ts"],
  ignore: [
    "bin/**", // Compiled JS files and shell scripts
    "tests/integration/node-js.test.ts", // Uses ${cliPath} in shell commands, not actual imports
  ],
  ignoreDependencies: ["tslib"],
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
};

export default config;
