import { highlightSpecialChars, drawSelection, highlightActiveLine, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { history, historyKeymap } from '@codemirror/history';
import { foldGutter, foldKeymap } from '@codemirror/fold';
import { indentOnInput } from '@codemirror/language';
import { lineNumbers } from '@codemirror/gutter';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { commentKeymap } from '@codemirror/comment';
import { rectangularSelection } from '@codemirror/rectangular-selection';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { lintKeymap } from '@codemirror/lint';
import {html} from "@codemirror/lang-html"
import {css} from "@codemirror/lang-css"
import {javascript, javascriptLanguage} from "@codemirror/lang-javascript"

const globalJavaScriptCompletions = javascriptLanguage.data.of({
  autocomplete: (context) => {
    console.log({context})
    let full = context.matchBefore(/\w*/)
    let word = context.matchBefore(/(s\-)\w*/) 
    console.log({full, word})
    // if (word.from == word.to && !context.explicit) return null
    if (!word) return null
    return {
      from: word.from,
      to: word.to,
      options: [
        {
          label: "s-if-block", 
          type: "text", 
          info: `Conditionally render with 'Switch' field`, 
          apply: `{#if condition}\n\n{/if}`
        },
        {
          label: "s-each-block", 
          type: "text", 
          info: `Loop over a repeater field`, 
          apply: `{#each items as item}\n\n<!-- <li>{item.property}</li> -->\n\n{/each}`
        }
      ]
    }
  }
})

console.log({globalJavaScriptCompletions})

export function getLanguage(mode) {
  return {
    'html': html(),
    'css': css(),
    'javascript': javascript()
  }[mode]
}

export default [
    lineNumbers(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    defaultHighlightStyle.fallback,
    bracketMatching(),
    closeBrackets(),
    rectangularSelection(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...lintKeymap
    ])
];
