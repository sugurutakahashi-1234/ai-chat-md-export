#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read version from package.json
const packagePath = join(__dirname, "..", "package.json");
const packageData = JSON.parse(readFileSync(packagePath, "utf-8"));
const version = packageData.version;

// Update version.ts
const versionPath = join(__dirname, "..", "src", "version.ts");
const versionContent = `// This file is auto-updated by release-it
export const VERSION = "${version}";
`;

writeFileSync(versionPath, versionContent);
console.log(`Updated version.ts to ${version}`);
