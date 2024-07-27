import { copyFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

function folderName(url) {
  const parts = url.split("/");
  return parts[parts.length - 1].split(".")[0];
}

// TODO: read build-sha file and if it is the same do nothing

const git = `mkdir tmp
cd tmp
git init
git remote add origin ${config.repository}
git fetch --depth=1 origin ${config.commit}
git checkout ${config.commit}`;

spawnSync(git, { stdio: "inherit", shell: true });

spawnSync(`npx -y tree-sitter-cli build --wasm`, {
  stdio: "inherit",
  shell: true,
  cwd: `tmp/${config.path}`,
});

rmSync(`./${folderName(config.repository)}.wasm`, { force: true });

copyFileSync(
  `tmp/${config.path}/${folderName(config.repository)}.wasm`,
  `${folderName(config.repository)}.wasm`
);

rmSync(`tmp`, { recursive: true });

// TODO: write build-sha file
