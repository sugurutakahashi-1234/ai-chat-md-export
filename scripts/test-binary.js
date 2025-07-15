#!/usr/bin/env bun
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const projectRoot = join(import.meta.dir, "..");

console.log("🧪 Testing binary...\n");

try {
  // Detect current platform
  const platform = process.platform;
  const arch = process.arch;

  // Map to Bun target format (matching .goreleaser.yaml)
  let target;
  let binaryName = "ai-chat-md-export";
  if (platform === "darwin") {
    target = arch === "x64" ? "darwin-x64" : "darwin-arm64";
  } else if (platform === "linux") {
    target = arch === "x64" ? "linux-x64-modern" : "linux-arm64";
  } else if (platform === "win32") {
    target = "windows-x64-modern";
    binaryName = "ai-chat-md-export.exe";
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  console.log(`🎯 Target: ${target}`);
  console.log(`📂 Platform: ${platform} (${arch})`);

  // Find the built binary
  const binaryPath = join(
    projectRoot,
    "dist",
    `ai-chat-md-export_bun-${target}`,
    binaryName,
  );

  if (!existsSync(binaryPath)) {
    console.error("\n❌ Binary not found at:", binaryPath);
    console.error("\nPlease build first with:");
    console.error("   bun run build:binary");
    console.error("\nOr build for current platform only:");
    console.error(
      `   TARGET=${target} goreleaser build --snapshot --clean --skip=validate --single-target`,
    );
    console.error("\nIf GoReleaser is not installed:");
    console.error("   brew install goreleaser");
    console.error("   or");
    console.error("   brew bundle  # Install from Brewfile");
    process.exit(1);
  }

  console.log(`📦 Binary found: ${binaryPath}`);

  // Test 1: Version
  console.log("\n1️⃣ Testing --version:");
  const version = execSync(`"${binaryPath}" --version`, { encoding: "utf8" });
  console.log(`   ✅ Version: ${version.trim()}`);

  // Test 2: Help
  console.log("\n2️⃣ Testing --help:");
  execSync(`"${binaryPath}" --help`, { encoding: "utf8" });
  console.log("   ✅ Help command works");

  console.log("\n✨ Binary is working correctly!");
} catch (error) {
  console.error("\n❌ Test failed:", error.message);
  process.exit(1);
}
