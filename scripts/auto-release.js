#!/usr/bin/env node
/**
 * bdks-fe 자동 릴리스 스크립트
 *
 * - npm 배포 없음 (private 프로젝트)
 * - 빌드 시 env는 build:prod (--mode prod)로 적용됨
 *
 * 사용법:
 *   pnpm run release
 *
 * 동작: package.json 버전 기준 → prod 빌드 → git tag 생성 → origin에 tag push
 */
import { readFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, "..", "package.json");

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
const version = packageJson.version;
const tagName = `v${version}`;

console.log(`${tagName} 릴리스 시작`);

try {
  // 1. prod 모드 빌드 (env는 --mode prod로 적용)
  console.log("🔨 Building (mode: prod)...");
  execSync("pnpm run build:prod", { stdio: "inherit" });

  // 2. Git tag 생성
  console.log(`📌 Creating git tag: ${tagName}`);
  execSync(`git tag ${tagName}`, { stdio: "inherit" });

  // 3. Tag를 origin에 push
  console.log(`📤 Pushing tag to origin: ${tagName}`);
  execSync(`git push origin ${tagName}`, { stdio: "inherit" });

  console.log(`✅ Successfully released ${tagName}`);
} catch (error) {
  console.error("❌ Release failed:", error.message);
  process.exit(1);
}
