const { execSync } = require("child_process");
const fs = require("fs");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = `v${pkg.version}`;

try {
  console.log(`📦 Releasing ${version} ...`);

  // 确保本地代码已提交
  execSync("git add . && git commit -m 'chore: release " + version + "'", {
    stdio: "inherit",
  });

  // 打 tag
  execSync(`git tag ${version}`, { stdio: "inherit" });

  // 推送到远端，触发 GitHub Actions
  execSync("git push origin --tags", { stdio: "inherit" });

  console.log(`✅ Release triggered for ${version}`);
} catch (err) {
  console.error("⚠️ Error creating release:", err.message);
  process.exit(1);
}