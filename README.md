# tree-sitter-grammar-wasm

Idea is to create repo with tree-sitter grammars, compile them to WASM and publish.

For inspiration, collection of other grammars:

- [shikijs textmate grammars](https://github.com/shikijs/textmate-grammars-themes/tree/main)
- [linguist grammars](https://github.com/github-linguist/linguist/blob/master/grammars.yml)

Where to get tree-sitter grammars:

- [official website](https://tree-sitter.github.io/tree-sitter/#parsers)
- [tree-sitter-grammars](https://github.com/tree-sitter-grammars)
- [github search - topic:tree-sitter grammar](https://github.com/search?q=topic%3Atree-sitter+fork%3Atrue++language%3AC+grammar&type=repositories)
- [ZED extensions for grammars](https://github.com/zed-industries/extensions/blob/main/AUTHORING_EXTENSIONS.md), like
  ```toml
  [grammars.gleam]
  repository = "https://github.com/gleam-lang/tree-sitter-gleam"
  commit = "58b7cac8fc14c92b0677c542610d8738c373fa81"
  ```

Gramamrs can be used with [web-tree-sitter](https://www.npmjs.com/package/web-tree-sitter) or Rust (like [they do in Zed](https://zed.dev/blog/language-extensions-part-1#challenges-with-packaging-parsers)).

## To add grammar

1. create folder `something`
2. create file `something/config.json`

   ```json
   {
     "repository": "https://github.com/tree-sitter-grammars/tree-sitter-markdown.git",
     "commit": "7fe453beacecf02c86f7736439f238f5bb8b5c9b"
   }
   ```

3. create PR
4. as soon as PR merged npm package `@tsgw/something` will be published automatically

## TODO

- [ ] how to publish `typescript` and `tsx` packages separately (or together)?
- [ ] how to publish different versions of SQL dialects?
