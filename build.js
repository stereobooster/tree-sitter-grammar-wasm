import {
  readdirSync,
  copyFileSync,
  rmSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";

function folderName(url) {
  const parts = url.split("/");
  return parts[parts.length - 1].split(".")[0];
}

function packageJson({ name, version, author, license, wasmFile }) {
  return {
    name: `@tsg-wasm/${name}`,
    version,
    description: `${name} grammar for tree-sitter`,
    author,
    license,
    keywords: ["grammar", "tree-sitter", name],
    files: [wasmFile],
    exports: {
      ".": `./${wasmFile}`,
      [`./${wasmFile}`]: `./${wasmFile}`,
    },
    repository: {
      type: "git",
      url: "git@github.com:stereobooster/tree-sitter-grammar-wasm.git",
      directory: `packages/${name}`,
    },
  };
}

const base = "packages";
readdirSync(base).forEach((name) => {
  if (name == "experiment") return;

  const packagePath = `${base}/${name}`;
  const config = JSON.parse(readFileSync(`${packagePath}/config.json`, "utf8"));

  const subPath = config.path ? `${config.path}/` : "";
  const gitFolderName = folderName(config.repository);
  const wasmFile = `${gitFolderName}.wasm`;
  const tmpPath = `${packagePath}/tmp/`;

  // TODO: read build-sha file and if it is the same do nothing

  const git = `cd ${packagePath}
mkdir tmp
cd tmp
git init
git remote add origin ${config.repository}
git fetch --depth=1 origin ${config.commit}
git checkout ${config.commit}`;

  spawnSync(git, { stdio: "inherit", shell: true });

  const orginalPkg = JSON.parse(readFileSync(`${tmpPath}package.json`, "utf8"));

  const { version, author, license } = orginalPkg;

  writeFileSync(
    `${packagePath}/package.json`,
    JSON.stringify(
      packageJson({ name, version, author, license, wasmFile }),
      null,
      2
    )
  );

  spawnSync(`npx -y tree-sitter-cli build --wasm`, {
    stdio: "inherit",
    shell: true,
    cwd: `${tmpPath}${subPath}`,
  });

  rmSync(`${packagePath}/${wasmFile}`, {
    force: true,
  });

  copyFileSync(`${tmpPath}${subPath}${wasmFile}`, `${packagePath}/${wasmFile}`);

  // TODO: write build-sha file

  // TODO: update package.json

  rmSync(tmpPath, { recursive: true });
});
