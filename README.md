# tree-sitter-grammar-wasm

Idea is to create repo with tree-sitter grammars, compile them to WASM and publish.

For inspiration, collection of other grammars:

- [shikijs textmate grammars](https://github.com/shikijs/textmate-grammars-themes/tree/main)
- [linguist grammars](https://github.com/github-linguist/linguist/blob/master/grammars.yml)

Where to get tree-sitter grammars:

- [tree-sitter-grammars](https://github.com/tree-sitter-grammars)
- [github search - topic:tree-sitter grammar](https://github.com/search?q=topic%3Atree-sitter+fork%3Atrue++language%3AC+grammar&type=repositories)
- [ZED extensions for grammars](https://github.com/zed-industries/extensions/blob/main/AUTHORING_EXTENSIONS.md), like
  ```toml
  [grammars.gleam]
  repository = "https://github.com/gleam-lang/tree-sitter-gleam"
  commit = "58b7cac8fc14c92b0677c542610d8738c373fa81"
  ```

Gramamrs can be used with [web-tree-sitter](https://www.npmjs.com/package/web-tree-sitter) or Rust (like [they do in Zed](https://zed.dev/blog/language-extensions-part-1#challenges-with-packaging-parsers)).

Ideally we can use Github CI to compile grammars and publish them either to Github releases or to npm:

- [Automate npm publishing with GitHub Actions, proper changelog, and release notes](https://superface.ai/blog/npm-publish-gh-actions-changelog)
- [Publishing Node.js packages](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
- [How To Automatically update git submodules using GitHub Actions](https://medium.com/@0xWerz/how-to-automatically-update-git-submodules-using-github-actions-d71c8126e82e)
