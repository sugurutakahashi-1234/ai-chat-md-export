#!/usr/bin/env bun
/**
 * NPM Package E2E Test
 *
 * Tests the complete NPM package lifecycle:
 * 1. Create package with `npm pack`
 * 2. Install globally with `npm install -g`
 * 3. Run CLI commands from global PATH
 * 4. Clean up installation
 *
 * This simulates the actual user experience when installing from NPM.
 */
import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

console.log("🧪 Starting npm package E2E test...\n");

const projectRoot = join(import.meta.dir, "..");
const packageName = "ai-chat-md-export";
let packageFile = null;
let isInstalled = false;

// Clean up any existing installation first
try {
  console.log("🧹 Checking for existing installation...");
  execSync(`npm uninstall -g ${packageName}`, { stdio: "pipe" });
  console.log("✅ Removed existing installation");
} catch (_e) {
  // Package not installed, which is fine
  console.log("✅ No existing installation found");
}

try {
  // Step 1: Check if built
  const libDir = join(projectRoot, "lib");
  if (!existsSync(libDir)) {
    console.error(
      "❌ Project not built. Please run 'bun run build:npm' first.",
    );
    process.exit(1);
  }

  // Step 2: Create npm package
  console.log("\n📦 Creating npm package...");
  const packOutput = execSync("npm pack", { cwd: projectRoot })
    .toString()
    .trim();
  packageFile = packOutput.split("\n").pop(); // Get the last line (filename)
  console.log(`✅ Created: ${packageFile}`);

  // Check package size
  const sizeOutput = execSync(`npm pack --dry-run --json`, {
    cwd: projectRoot,
  });
  const packInfo = JSON.parse(sizeOutput);
  const sizeMB = packInfo[0].size / (1024 * 1024);
  console.log(`📊 Package size: ${sizeMB.toFixed(2)} MB`);

  if (sizeMB > 1) {
    console.warn(`⚠️  Warning: Package size is large (${sizeMB.toFixed(2)} MB)`);
  }

  // Step 3: Install globally
  console.log("\n📥 Installing package globally...");
  execSync(`npm install -g ${join(projectRoot, packageFile)}`, {
    stdio: "inherit",
  });
  isInstalled = true;

  // Step 4: Test commands
  console.log("\n🧪 Testing commands...");

  // Test version
  console.log("  Testing --version...");
  const version = execSync(`${packageName} --version`).toString().trim();
  console.log(`  ✅ Version: ${version}`);

  // Test help
  console.log("  Testing --help...");
  execSync(`${packageName} --help`, { stdio: "pipe" });
  console.log("  ✅ Help command works");

  console.log("\n✅ All tests passed!");
} catch (error) {
  console.error("\n❌ Test failed:", error.message);
  process.exit(1);
} finally {
  // Cleanup
  console.log("\n🧹 Cleaning up...");

  if (isInstalled) {
    try {
      execSync(`npm uninstall -g ${packageName}`, { stdio: "pipe" });
      console.log("✅ Package uninstalled");
    } catch (_e) {
      console.warn("⚠️  Failed to uninstall package");
    }
  }

  if (packageFile && existsSync(join(projectRoot, packageFile))) {
    rmSync(join(projectRoot, packageFile));
    console.log("✅ Package file removed");
  }
}

console.log("\n✨ E2E test completed!");
