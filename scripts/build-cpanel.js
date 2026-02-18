const fs = require("fs");
const path = require("path");

const root = process.cwd();
const buildRoot = path.join(root, "cpanel-build");
const standaloneDir = path.join(root, ".next", "standalone");
const staticDir = path.join(root, ".next", "static");
const publicDir = path.join(root, "public");

function ensureExists(targetPath, message) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(message);
  }
}

function copyDir(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

function main() {
  ensureExists(
    standaloneDir,
    "Missing .next/standalone. Run `npm run build` first."
  );
  ensureExists(staticDir, "Missing .next/static. Run `npm run build` first.");

  fs.rmSync(buildRoot, { recursive: true, force: true });
  fs.mkdirSync(buildRoot, { recursive: true });

  copyDir(standaloneDir, buildRoot);
  copyDir(staticDir, path.join(buildRoot, ".next", "static"));

  if (fs.existsSync(publicDir)) {
    copyDir(publicDir, path.join(buildRoot, "public"));
  }

  const deployReadme = `cPanel deployment package

1. Upload everything inside this folder to your server app directory.
2. Set environment variables in cPanel (same keys as your .env.local).
3. Start command: node server.js
4. Make sure Node.js version is 18+ (prefer 20).
`;

  fs.writeFileSync(path.join(buildRoot, "DEPLOY.txt"), deployReadme, "utf8");

  console.log("cpanel-build created successfully.");
}

main();