import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap } from '@codemirror/view';
export { EditorView } from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap, undo, redo, indentMore, indentLess } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import {oneDark} from "@codemirror/theme-one-dark"

const editorSetup:Extension = /*@__PURE__*/(() => [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        // Alt added to default historyKeymap as they are not normally stopped by JupyterLab
        // unless user adds such key bindings.
        { key: "Alt-Mod-z", run: undo, preventDefault: true },
        { key: "Alt-Mod-y", mac: "Alt-Mod-Shift-z", run: redo, preventDefault: true },
        { linux: "Alt-Ctrl-Shift-z", run: redo, preventDefault: true },
        { key: "Alt-Ctrl-Tab", run: indentMore, preventDefault: true },
        { key: "Alt-Ctrl-Shift-Tab", run: indentLess, preventDefault: true },
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap
    ]),
    oneDark
])();

export { editorSetup };