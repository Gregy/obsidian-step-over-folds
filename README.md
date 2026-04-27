# Step Over Folds

An Obsidian plugin that makes Enter step *over* a folded heading instead of unfolding it.

## What it does

When the cursor is at the end of a folded heading line — to the right of the `…` fold marker — pressing **Enter** inserts a new heading of the same level *below* the folded section. The fold stays intact.

Default Obsidian behavior is to unfold the section so the new content lands inside it. This plugin assumes that if a section is folded and you've placed your cursor past it, you're done with that section and want to start a sibling.

## Example

Given this state, with the cursor right after the fold marker:

```
## Section A…│
```

pressing Enter produces:

```
## Section A…
## │
```

…and Section A remains folded.

## When the plugin does not intervene

Enter behaves normally if any of the following is true:

- The cursor is not exactly at the right edge of a fold marker.
- The folded range does not start on a Markdown heading line (`#` to `######`).
- There is an active selection rather than a single cursor.

## Installing

Not yet on the community catalogue. To install manually:

1. Run `npm install && npm run build` in this repo.
2. Copy `main.js` and `manifest.json` into `<vault>/.obsidian/plugins/step-over-folds/`.
3. Reload Obsidian and enable **Step Over Folds** under Settings → Community plugins.

## Developing

```
npm install
npm run dev      # esbuild watch + inline sourcemap
npm run build    # tsc check + production bundle
```

The plugin registers a high-precedence CodeMirror keymap entry on Enter. When the cursor is at the `to` boundary of a folded range whose start line is a Markdown heading, it inserts `\n` plus the same number of `#` characters at that boundary. Because the change transaction transiently drops the fold, a follow-up transaction with `foldEffect` re-asserts it.

## License

MIT — see [LICENSE](LICENSE).
