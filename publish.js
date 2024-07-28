import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { env } from "node:process";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2));
}

const lockPath = "build-lock.json";
const buildLock = readJson(lockPath);

const base = "packages";
readdirSync(base).forEach((name) => {
  if (name == "experiment") return;

  const packagePath = `${base}/${name}`;
  const pkg = readJson(`${packagePath}/package.json`);

  if (buildLock[name] && buildLock[name].version === pkg.version) {
    return;
  }

  buildLock[name] = buildLock[name] || {};
  buildLock[name].version = pkg.version;

  spawnSync("npm publish --provenance --access public", {
    stdio: "inherit",
    shell: true,
    cwd: packagePath,
  });
});

writeJson(lockPath, buildLock);
