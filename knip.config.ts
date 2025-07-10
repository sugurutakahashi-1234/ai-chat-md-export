import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.ts", "tests/**/*.ts"],
  ignore: [
    "tests/integration/node-js.test.ts", // Uses $`node ${cliPath}` syntax which knip misinterprets
  ],
  ignoreDependencies: ["tslib"],
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
};

export default config;
