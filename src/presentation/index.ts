// Main export file
// This file serves as the entry point when used as a package
//
// IMPORTANT: This package is primarily designed as a CLI tool.
// The exported API is intentionally minimal - only the CLI entry point is exposed.
// All other modules (converters, handlers, utils) are internal implementation details
// and should not be imported directly.

// CLI entry point - the only public API
export { main } from "./cli.js";
