import { Plugin } from 'obsidian';
import { EditorView, keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { foldedRanges, foldEffect } from '@codemirror/language';

export default class FoldAwareEnterPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(
			Prec.high(keymap.of([{
				key: 'Enter',
				run: (view) => this.handleEnter(view),
			}])),
		);
	}

	handleEnter(view: EditorView): boolean {
		const { state } = view;
		const sel = state.selection.main;

		// Only act on a plain cursor (no selection)
		if (!sel.empty) return false;

		const pos = sel.head;

		// Only react when the cursor is just to the right of the … marker,
		// i.e. at the `to` end of a folded range.
		let foldFrom: number | null = null;
		let foldTo: number | null = null;
		foldedRanges(state).between(pos, pos, (from, to) => {
			if (foldFrom !== null) return;
			if (pos === to) {
				foldFrom = from;
				foldTo = to;
			}
		});
		if (foldFrom === null || foldTo === null) return false;

		// The fold must start on a heading line.
		const headingLine = state.doc.lineAt(foldFrom);
		const m = headingLine.text.match(/^(#{1,6})\s/);
		if (!m || !m[1]) return false;
		const level = m[1].length;

		// Insert a new heading of the same level after the fold.
		// Obsidian drops the fold during the change transaction, so we
		// re-assert it in a separate follow-up transaction.
		const insert = '\n' + '#'.repeat(level) + ' ';
		view.dispatch({
			changes: { from: foldTo, insert },
			selection: { anchor: foldTo + insert.length },
			scrollIntoView: true,
			userEvent: 'input',
		});
		view.dispatch({
			effects: foldEffect.of({ from: foldFrom, to: foldTo }),
		});

		return true;
	}
}
