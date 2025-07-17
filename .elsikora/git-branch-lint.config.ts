import type { IBranchLintConfig } from "@elsikora/git-branch-lint";

const config: IBranchLintConfig = {
  // Branch prefixes based on Conventional Commits types (not traditional GitFlow)
  // These prefixes align with commit message types for consistency
  branches: [
    "feat",
    "feature",
    "fix",
    "docs",
    "style",
    "refactor",
    "test",
    "chore",
    "ci",
    "perf",
    "build",
    "revert",
  ],
  ignore: [
    "main",
    // Release Please creates this branch automatically for release management
    "release-please--branches--main--components--ai-chat-md-export",
  ],
  rules: {
    "branch-pattern": ":type/:name",
    "branch-subject-pattern": "[a-z0-9-]+",
    "branch-prohibited": ["master", "prod", "production"],
    "branch-min-length": 5,
    "branch-max-length": 50,
  },
};

export default config;
