import Parser from "web-tree-sitter";

import * as importMetaResolve from "import-meta-resolve";
const wasmPath = importMetaResolve
  .resolve(
    "@tree-sitter-grammars/tree-sitter-markdown",
    import.meta.url
  )
  .replace("file://", "");

// import resolve from "@webfill/import-meta-resolve";
// const wasmPath = resolve(
//   import.meta,
//   "@tree-sitter-grammars/tree-sitter-markdown"
// ).replace("file://", "");

await Parser.init();

const md = await Parser.Language.load(wasmPath);

const parser = new Parser();
parser.setLanguage(md);

const sourceCode = `# header

**bold**
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode);
