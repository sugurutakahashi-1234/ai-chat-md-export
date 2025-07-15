#!/usr/bin/env bun
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const projectRoot = join(import.meta.dir, "..");

console.log("🧪 Testing GoReleaser configuration...\n");

// Check if goreleaser is installed
try {
  execSync("goreleaser --version", { stdio: "pipe" });
} catch {
  console.log("⚠️  GoReleaser is not installed. Install it with:");
  console.log("   brew install goreleaser");
  console.log("   or");
  console.log("   go install github.com/goreleaser/goreleaser/v2@latest");
  console.log("\nSkipping test...");
  process.exit(0);
}

try {
  console.log("📦 Running GoReleaser build test...");
  console.log("   This will build binaries for the current platform only.\n");

  // Detect current platform
  const platform = process.platform;
  const arch = process.arch;

  // Map to Bun target format
  let target;
  if (platform === "darwin") {
    target = arch === "x64" ? "darwin-x64" : "darwin-arm64";
  } else if (platform === "linux") {
    target = arch === "x64" ? "linux-x64" : "linux-arm64";
  } else if (platform === "win32") {
    target = "windows-x64";
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  console.log(`🎯 Target: ${target}`);

  // Run goreleaser with single target
  execSync(
    `TARGET=${target} goreleaser build --snapshot --clean --skip=validate --single-target`,
    { stdio: "inherit", cwd: projectRoot, shell: true },
  );

  // Check if binary was created
  const distDir = join(projectRoot, "dist");
  if (existsSync(distDir)) {
    console.log("\n✅ GoReleaser build successful!");
    console.log("   Check the 'dist' directory for built binaries.");
  } else {
    console.log("\n❌ Build failed - no dist directory created");
    process.exit(1);
  }
} catch (error) {
  console.error("\n❌ GoReleaser build failed:", error.message);
  process.exit(1);
}
