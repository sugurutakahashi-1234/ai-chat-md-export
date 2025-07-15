import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  // Show help URL when commit linting fails
  helpUrl: "https://www.conventionalcommits.org/",

  rules: {
    // Disable body line length limit for detailed descriptions
    "body-max-line-length": [0],

    // Require minimum 5 characters in subject
    "subject-min-length": [2, "always", 5],

    // Limit subject line to 72 characters (GitHub PR title friendly)
    "subject-max-length": [2, "always", 72],
  },

  ignores: [
    // Temporary commits
    (commit) => commit.includes("WIP"),
    (commit) => commit.includes("TODO"),
    // Auto-generated commits
    (commit) => commit.startsWith("Merge"),
    (commit) => /^Revert/.test(commit),
    (commit) => /^Initial commit/.test(commit),
  ],
};

export default config;
