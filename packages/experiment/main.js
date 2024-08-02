// based on https://adrian.schoenig.me/blog/2022/05/27/tree-sitter-highlighting-in-jekyll/#full-script

import { readFileSync, writeFileSync } from "node:fs";
import Parser from "web-tree-sitter";
import * as importMetaResolve from "import-meta-resolve";
import { encode } from "html-entities";

const code = `const x = (k) => {}`;
const langName = "javascript";

const wasmPath = importMetaResolve
  .resolve(`@tsgw/${langName}/tree-sitter-${langName}.wasm`, import.meta.url)
  .replace("file://", "");

await Parser.init();

const lang = await Parser.Language.load(wasmPath);

const parser = new Parser();
parser.setLanguage(lang);

const queryPath = importMetaResolve
  .resolve(`@tsgw/${langName}/queries/highlights.scm`, import.meta.url)
  .replace("file://", "");

const highlights = readFileSync(queryPath).toString();
const query = lang.query(highlights);

const tree = parser.parse(code);

var adjusted = "";
var lastEnd = 0;

// See also: <https://github.com/primer/github-syntax-dark/blob/master/lib/github-dark.css>
// const scopeToClassGithub = {
//   'brackethighlighter.angle': 'pl-ba',
//   'brackethighlighter.curly': 'pl-ba',
//   'brackethighlighter.quote': 'pl-ba',
//   'brackethighlighter.round': 'pl-ba',
//   'brackethighlighter.square': 'pl-ba',
//   'brackethighlighter.tag': 'pl-ba',
//   'brackethighlighter.unmatched': 'pl-bu',

//   "carriage-return": "pl-c2",
//   comment: "pl-c",
//   constant: "pl-c1",
//   "constant.character.escape": "pl-cce",
//   "constant.other.reference.link": "pl-corl",
//   entity: "pl-e",
//   "entity.name": "pl-en",
//   "entity.name.constant": "pl-c1",
//   "entity.name.tag": "pl-ent",
//   "invalid.broken": "pl-bu",
//   "invalid.deprecated": "pl-bu",
//   "invalid.illegal": "pl-ii",
//   "invalid.unimplemented": "pl-bu",
//   keyword: "pl-k",
//   // Note: this is included as `symbole` by GH, which is not included in any
//   // grammar.
//   // Should likely be `symbol`.
//   "keyword.operator.symbol": "pl-kos",
//   "keyword.other.mark": "pl-kos",
//   "markup.bold": "pl-mb",
//   "markup.changed": "pl-mc",
//   "markup.deleted": "pl-md",
//   "markup.heading": "pl-mh",
//   "markup.ignored": "pl-mi2",
//   "markup.inserted": "pl-mi1",
//   "markup.italic": "pl-mi",
//   "markup.list": "pl-ml",
//   "markup.quote": "pl-ent",
//   "markup.raw": "pl-c1",
//   "markup.untracked": "pl-mi2",
//   "message.error": "pl-bu",
//   "meta.diff.header": "pl-c1",
//   "meta.diff.header.from-file": "pl-md",
//   "meta.diff.header.to-file": "pl-mi1",
//   "meta.diff.range": "pl-mdr",
//   "meta.module-reference": "pl-c1",
//   "meta.output": "pl-c1",
//   "meta.property-name": "pl-c1",
//   "meta.separator": "pl-ms",
//   "punctuation.definition.changed": "pl-mc",
//   "punctuation.definition.comment": "pl-c",
//   "punctuation.definition.deleted": "pl-md",
//   "punctuation.definition.inserted": "pl-mi1",
//   "punctuation.definition.string": "pl-pds",
//   "punctuation.section.embedded": "pl-pse",

//   // Note: orignally this is listed as `source` on GH.
//   // However, every `source*` scope matches that in `vscode-textmate`, making it
//   // useless because everything inside strings again matches it, meaning strings
//   // aren’t colored.
//   // For now, I instead looked for `\.source'` in `lang/`, and listed them below:
//   "source.coffee.embedded.source": "pl-s1",
//   "source.groovy.embedded.source": "pl-s1",
//   "source.jq.embedded.source": "pl-s1",
//   "source.js.embedded.source": "pl-s1",
//   "source.livescript.embedded.source": "pl-s1",
//   "support.mnemonic.operand.source": "pl-s1",
//   "source.nu.embedded.source": "pl-s1",
//   "source.prisma.embedded.source": "pl-s1",
//   "source.scala.embedded.source": "pl-s1",
//   "stylus.embedded.source": "pl-s1",

//   "source.regexp": "pl-pds",
//   "source.ruby.embedded": "pl-sre",
//   storage: "pl-k",
//   "storage.modifier.import": "pl-smi",
//   "storage.modifier.package": "pl-smi",
//   "storage.type": "pl-k",
//   "storage.type.java": "pl-smi",
//   string: "pl-s",
//   "string.comment": "pl-c",
//   "string.other.link": "pl-corl",
//   "string.regexp": "pl-sr",
//   "string.regexp.arbitrary-repitition": "pl-sra",
//   "string.regexp.character-class": "pl-pds",
//   "string.unquoted.import.ada": "pl-kos",
//   "sublimelinter.gutter-mark": "pl-sg",
//   "sublimelinter.mark.error": "pl-bu",
//   "sublimelinter.mark.warning": "pl-smw",
//   support: "pl-c1",
//   "support.constant": "pl-c1",
//   "support.variable": "pl-c1",
//   variable: "pl-v",
//   "variable.language": "pl-c1",
//   "variable.other": "pl-smi",
//   "variable.other.constant": "pl-c1",
//   "variable.parameter.function": "pl-smi",
// };

const scopeToClassGithub = {
  string: "pl-s",
  "punctuation.bracket": "pl-ba",
  function: "pl-smi",
  "function.method": "pl-smi",
  // "punctuation.delimiter"
  variable: "pl-v",
  keyword: "pl-k",
  operator: "pl-kos",
  // "number"
};

query.matches(tree.rootNode).forEach((match) => {
  const name = match.captures[0].name;
  const text = match.captures[0].node.text;
  const start = match.captures[0].node.startIndex;
  const end = match.captures[0].node.endIndex;

  if (start < lastEnd) {
    return;
  }
  if (start > lastEnd) {
    adjusted += code.substring(lastEnd, start);
  }
  const cssClass = scopeToClassGithub[name];
  adjusted += cssClass
    ? `<span class="${cssClass}">${encode(text)}</span>`
    : encode(text);
  lastEnd = end;
});

if (lastEnd < code.length) {
  adjusted += code.substring(lastEnd);
}

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="./both.css" />
    <style>
    pre {
      margin-top: 0;
      margin-bottom: 0;
      font-family: var(--fontStack-monospace, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace);
      font-size: 12px;
    }
    .highlight pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      color: var(--fgColor-default);
      background-color: var(--bgColor-muted);
      border-radius: 6px;
      word-break: normal;
      word-wrap: normal;
    }
    .overflow-auto {
      overflow: auto !important;
    }
    .position-relative {
      position: relative !important;
    }
    * {
      box-sizing: border-box;
    }
    </style>
  </head>
  <body>
    <div class="highlight highlight-source-js notranslate position-relative overflow-auto" dir="auto">
      <pre><code>${adjusted}</code></pre>
    </div>
  </body>
</html>`;

writeFileSync("test.html", html);
