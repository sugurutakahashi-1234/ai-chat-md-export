import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { VERSION } from "./version.js";

describe("version", () => {
  test("VERSION constant should match package.json version", () => {
    // Read package.json from project root
    const projectRoot = join(import.meta.dir, "..", "..");
    const packageJsonPath = join(projectRoot, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    const packageVersion = packageJson.version;

    // Compare versions
    expect(VERSION).toBe(packageVersion);
  });
});
