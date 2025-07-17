import type { IBranchLintConfig } from "@elsikora/git-branch-lint";

// Configuration for Git Branch Lint
// See: https://github.com/ElsiKora/Git-Branch-Lint
const config: IBranchLintConfig = {
  branches: [
    // Standard GitFlow branch types
    "feature",
    "release",
    "hotfix",
    "bugfix",

    // Conventional Commits-based branch types
    // These align with commit message types for consistency
    "feat",
    "fix",
    "perf",
    "docs",
    "style",
    "refactor",
    "test",
    "build",
    "ci",
    "chore",
  ],
  ignore: [
    // GitFlow main branches (long-lived)
    "main",
    "develop", // GitFlow development branch

    // Release Please creates this branch automatically for release management
    "release-please--branches--main--components--ai-chat-md-export",
  ],
  rules: {
    "branch-pattern": ":type/:name",
    "branch-subject-pattern": "[a-z0-9-]+",
    "branch-min-length": 5,
    "branch-max-length": 50,
  },
};

export default config;
