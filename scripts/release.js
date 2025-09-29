const { execSync } = require("child_process");
const fs = require("fs");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = `v${pkg.version}`;

console.log(`📦 Releasing ${version} ...`);

try {
  // 尝试 commit，如果没有修改则跳过
  try {
    execSync(`git add . && git commit -m "chore: release ${version}"`, { stdio: "inherit" });
  } catch (err) {
    console.log("⚠️ No changes to commit, skipping commit step.");
  }

  // 打 tag
  execSync(`git tag ${version}`, { stdio: "inherit" });

  // 推送到远端
  execSync("git push origin --tags", { stdio: "inherit" });

  console.log(`✅ Release triggered for ${version}`);
} catch (err) {
  console.error("⚠️ Error creating release:", err.message);
  process.exit(1);
}