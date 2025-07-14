import type { IBranchLintConfig } from "@elsikora/git-branch-lint";

const config: IBranchLintConfig = {
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
  ignore: ["main", "develop"],
  rules: {
    "branch-pattern": ":type/:name",
    "branch-subject-pattern": "[a-z0-9-]+",
    "branch-prohibited": ["master", "prod", "production"],
    "branch-min-length": 5,
    "branch-max-length": 50,
  },
};

export default config;
