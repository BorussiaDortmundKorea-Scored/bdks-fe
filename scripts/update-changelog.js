#!/usr/bin/env node
/**
 * CHANGELOG 자동 업데이트 스크립트
 *
 * 사용법:
 *   node scripts/update-changelog.js "refactor: admin-match-lineup 컴포넌트를 yd-ui Table로 교체"
 *
 * 또는 package.json에 스크립트 추가:
 *   "changelog": "node scripts/update-changelog.js"
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHANGELOG_PATH = path.join(__dirname, "..", "CHANGELOG.md");

// 커밋 메시지 타입을 CHANGELOG 섹션으로 매핑
const TYPE_TO_SECTION = {
  feat: "추가",
  fix: "수정",
  refactor: "변경",
  style: "변경",
  chore: "변경",
  docs: "변경",
  test: "변경",
  perf: "변경",
  ci: "변경",
  build: "변경",
  revert: "제거",
};

/**
 * 커밋 메시지에서 타입과 내용 추출
 * 예: "refactor: admin-match-lineup 컴포넌트를 yd-ui Table로 교체"
 * -> { type: "refactor", message: "admin-match-lineup 컴포넌트를 yd-ui Table로 교체" }
 */
function parseCommitMessage(commitMsg) {
  const match = commitMsg.match(/^(feat|fix|refactor|style|docs|test|chore|perf|ci|build|revert)(\(.+\))?:\s*(.+)$/);
  if (!match) {
    throw new Error(
      `커밋 메시지 형식이 올바르지 않습니다: ${commitMsg}\n` + `형식: "type: 메시지" (예: "refactor: 컴포넌트 교체")`,
    );
  }
  return {
    type: match[1],
    message: match[3].trim(),
  };
}

/**
 * CHANGELOG 파일 읽기
 */
function readChangelog() {
  return fs.readFileSync(CHANGELOG_PATH, "utf-8");
}

/**
 * CHANGELOG 파일에 항목 추가
 */
function addChangelogEntry(changelog, type, message) {
  const section = TYPE_TO_SECTION[type] || "변경";
  const versionPattern = /## \[(\d+\.\d+\.\d+)\]/;
  const lines = changelog.split("\n");
  let versionIndex = -1;
  let sectionIndex = -1;

  // 최신 버전 섹션 찾기
  for (let i = 0; i < lines.length; i++) {
    if (versionPattern.test(lines[i])) {
      versionIndex = i;
      break;
    }
  }

  if (versionIndex === -1) {
    throw new Error("CHANGELOG에서 버전 섹션을 찾을 수 없습니다.");
  }

  // 해당 섹션 찾기
  for (let i = versionIndex; i < lines.length; i++) {
    if (lines[i].includes(`### ${section}`)) {
      sectionIndex = i;
      break;
    }
  }

  if (sectionIndex === -1) {
    throw new Error(`CHANGELOG에서 "${section}" 섹션을 찾을 수 없습니다.`);
  }

  // 빈 섹션인지 확인
  const nextSectionIndex = lines.findIndex((line, idx) => idx > sectionIndex && line.startsWith("### "));
  const isEmpty =
    nextSectionIndex === -1
      ? lines.slice(sectionIndex + 1).every((line) => line.trim() === "" || line.startsWith("---"))
      : lines.slice(sectionIndex + 1, nextSectionIndex).every((line) => line.trim() === "");

  // 항목 추가
  const indent = "- ";
  const entry = `${indent}${type}: ${message}`;

  if (isEmpty) {
    // 빈 섹션인 경우 바로 추가
    lines.splice(sectionIndex + 1, 0, entry);
  } else {
    // 항목이 있는 경우 마지막 항목 다음에 추가
    let insertIndex = sectionIndex + 1;
    while (
      insertIndex < lines.length &&
      !lines[insertIndex].startsWith("### ") &&
      lines[insertIndex].trim() !== "" &&
      !lines[insertIndex].startsWith("---")
    ) {
      insertIndex++;
    }
    lines.splice(insertIndex, 0, entry);
  }

  return lines.join("\n");
}

/**
 * 메인 함수
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('사용법: node scripts/update-changelog.js "type: 메시지"');
    console.log("\n예시:");
    console.log('  node scripts/update-changelog.js "refactor: admin-match-lineup 컴포넌트를 yd-ui Table로 교체"');
    process.exit(1);
  }

  const commitMessage = args.join(" ");

  try {
    const { type, message } = parseCommitMessage(commitMessage);
    const changelog = readChangelog();
    const updatedChangelog = addChangelogEntry(changelog, type, message);

    fs.writeFileSync(CHANGELOG_PATH, updatedChangelog, "utf-8");
    console.log(`✅ CHANGELOG 업데이트 완료: ${type}: ${message}`);
  } catch (error) {
    console.error(`❌ 오류: ${error.message}`);
    process.exit(1);
  }
}

main();
