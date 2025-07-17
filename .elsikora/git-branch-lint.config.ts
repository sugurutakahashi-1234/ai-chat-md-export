import type { IBranchLintConfig } from "@elsikora/git-branch-lint";

const config: IBranchLintConfig = {
  branches: [
    // GitFlow branch types (still actively used)
    "feature", // New features
    "release", // Prepare for a new production release
    "hotfix", // Quick fixes to production
    "bugfix", // Bug fixes for development branch
    "support", // Support branches for older versions

    // Conventional Commits-based branch types
    // These align with commit message types for consistency
    "feat", // New features (Conventional Commits style)
    "fix", // Bug fixes (Conventional Commits style)
    "docs", // Documentation only changes
    "style", // Code style changes (formatting, missing semi-colons, etc)
    "refactor", // Code refactoring without changing functionality
    "test", // Adding or correcting tests
    "chore", // Maintenance tasks, dependency updates, etc
    "ci", // Changes to CI configuration files and scripts
    "perf", // Performance improvements
    "build", // Changes affecting build system or dependencies
    "revert", // Reverting previous commits
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
