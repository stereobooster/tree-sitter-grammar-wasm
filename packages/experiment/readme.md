# Experiment

## TODO

- [ ] add queries to packages
  - `highlights_query` - A string containing tree patterns for syntax highlighting. This
    should be non-empty, otherwise no syntax highlights will be added.
  - `injections_query` - A string containing tree patterns for injecting other languages into
    the document. This can be empty if no injections are desired.
  - `locals_query` - A string containing tree patterns for tracking local variable definitions
    and references. This can be empty if local variable tracking is not needed.
- [ ] translate from TreSitter node types to CSS classes, like this:
  - https://github.com/wooorm/starry-night/blob/main/lib/theme.js
- [ ] compile [Highlight](https://github.com/tree-sitter/tree-sitter/blob/master/highlight/) to WASM, but then I would need to load Languages (WASM) as dynamic libs (I think)
  - https://github.com/WebAssembly/tool-conventions/blob/main/DynamicLinking.md
  - https://emscripten.org/docs/compiling/Dynamic-Linking.html
