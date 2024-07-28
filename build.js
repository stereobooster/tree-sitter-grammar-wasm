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
    name: `@tsgw/${name}`,
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
  const config = readJson(`${packagePath}/config.json`);

  if (buildLock[name] && buildLock[name].commit === config.commit) {
    return;
  }

  buildLock[name] = buildLock[name] || {};
  buildLock[name].commit = config.commit;

  const subPath = config.path ? `${config.path}/` : "";
  const gitFolderName = folderName(config.repository);
  const wasmFile = `${gitFolderName}.wasm`;
  const tmpPath = `${packagePath}/tmp/`;

  writeFileSync(
    `${packagePath}/readme.md`,
    `# ${gitFolderName}

Source: ${config.repository}
Commit sha: ${config.commit}
`
  );

  const git = `cd ${packagePath}
mkdir tmp
cd tmp
git init
git remote add origin ${config.repository}
git fetch --depth=1 origin ${config.commit}
git checkout ${config.commit}`;

  spawnSync(git, { stdio: "inherit", shell: true });

  const orginalPkg = readJson(`${tmpPath}package.json`);

  const { version, author, license } = orginalPkg;

  writeJson(
    `${packagePath}/package.json`,
    packageJson({
      version: config.version || version,
      name,
      author,
      license,
      wasmFile,
    })
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

  rmSync(tmpPath, { recursive: true });
});

writeJson(lockPath, buildLock);
