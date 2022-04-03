<script>
  import {autocompletion} from '@codemirror/autocomplete'
  import '@fontsource/fira-code/index.css';
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { browser } from '$app/env';
  import { fade } from 'svelte/transition';
  import { createDebouncer } from '../../utils';
  const slowDebounce = createDebouncer(500);

  import { EditorView, keymap } from '@codemirror/view';
  import { standardKeymap, indentWithTab } from '@codemirror/commands';
  import { EditorState, Compartment } from '@codemirror/state';
  import MainTheme from './theme';
  import extensions, { getLanguage } from './extensions';

  const languageConf = new Compartment();
  const tabSize = new Compartment();

  const dispatch = createEventDispatcher();

  export let prefix = '';
  export let value = '';
  export let mode = 'html';
  export let style = '';
  export let debounce = false;
  export let selection = 0;

  let currentValue = value

  const language = getLanguage(mode);

  var Editor;
  const state = EditorState.create({
    selection: {
      anchor: selection,
    },
    doc: prefix + value,
    extensions: [
      autocompletion({
        // override: [ 
        //   (context) => {
        //     let full = context.matchBefore(/\w*/)
        //     let word = context.matchBefore(/(s\-)\w*/) 
        //     console.log({full, word})
        //     // if (word.from == word.to && !context.explicit) return null
        //     if (!word) return null
        //     return {
        //       from: word.from,
        //       to: word.to,
        //       options: [
        //         {
        //           label: "s-if-block", 
        //           type: "text", 
        //           info: `Conditionally render with 'Switch' field`, 
        //           apply: `{#if condition}\n\n{/if}`
        //         },
        //         {
        //           label: "s-each-block", 
        //           type: "text", 
        //           info: `Loop over a repeater field`, 
        //           apply: `{#each items as item}\n\n<!-- <li>{item.property}</li> -->\n\n{/each}`
        //         }
        //       ]
        //     }
        //   }
        // ]
      }),
      languageConf.of(language),
      keymap.of([
        standardKeymap,
        indentWithTab,
        {
          key: 'mod-1',
          run: () => {
            dispatch('tab-switch', 0);
            return true;
          },
        },
        {
          key: 'mod-2',
          run: () => {
            dispatch('tab-switch', 1);
            return true;
          },
        },
        {
          key: 'mod-3',
          run: () => {
            dispatch('tab-switch', 2);
            return true;
          },
        },
        {
          key: 'mod-s',
          run: () => {
            dispatch('save');
            return true;
          },
        },
        {
          key: 'mod-Enter',
          run: () => {
            const value = Editor.state.doc.toString();
            const position = Editor.state.selection.main.head;
            formatCode(value, { mode, position }).then((res) => {
              if (!res) return;
              const { formatted, cursorOffset } = res;
              Editor.dispatch({
                changes: [
                  { from: 0, to: Editor.state.doc.length, insert: formatted },
                ],
                selection: {
                  anchor: cursorOffset,
                },
              });
              dispatchChanges(formatted);
            });
            return true;
          },
        },
      ]),
      EditorView.updateListener.of((view) => {
        if (view.docChanged) {
          currentValue = view.state.doc.toString();
          value = currentValue.replace(prefix, '');
          if (debounce) {
            slowDebounce([dispatchChanges, value]);
          } else {
            dispatchChanges(value);
          }
        }
        selection = view.state.selection.main.from;
      }),
      MainTheme,
      tabSize.of(EditorState.tabSize.of(2)),
      ...extensions,
    ],
  });

  let prettier;
  let css;
  let babel;
  let svelte;
  if (browser) fetchPrettier();

  async function fetchPrettier() {
    prettier = await import('prettier');
    css = (await import('prettier/esm/parser-postcss')).default;
    babel = (await import('prettier/esm/parser-babel')).default;
    svelte = (await import('prettier-plugin-svelte'));
  }

  async function formatCode(code, { mode, position }) {
    let formatted;
    try {
      if (mode === 'javascript') {
        mode = 'babel';
      } else if (mode === 'html') {
        mode = 'svelte'
      }

      formatted = prettier.formatWithCursor(code, {
        parser: mode,
        bracketSameLine: true,
        cursorOffset: position,
        plugins: [svelte, css, babel],
      });
    } catch (e) {
      console.warn(e);
    }
    return formatted;
  }

  $: Editor && updateValue(value)

  // handle changes when passed-in value changes
  function updateValue(value) {
    console.log(value, currentValue)
    if (value !== currentValue) {
      Editor.dispatch({
        changes: [
          { from: 0, to: Editor.state.doc.length, insert: value },
        ],
      });
    }
  }

  onMount(async () => {
    Editor = new EditorView({
      state,
      parent: editorNode,
    });
  });

  let editorNode;

  function dispatchChanges(value) {
    dispatch('change', value);
  }

  let element;
</script>

<svelte:window
  on:resize={() => {
    // Editor.setSize(null, editorNode.clientHeight)
  }}
/>

<div bind:this={element} class="codemirror-container {mode}" {style}>
  <div in:fade={{ duration: 200 }} bind:this={editorNode} />
  <a class="docs" target="blank" href="https://docs.primo.af/development">
    <span>Docs</span>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  </a>
</div>

<style lang="postcss">
  .codemirror-container {
    position: relative;
    width: 100%;
    overflow-x: scroll;
    font-family: 'Fira Code', 'Courier New', sans-serif !important;
    height: calc(100vh - 10rem);
  }
  .docs {
    position: sticky;
    bottom: 0.25rem;
    left: 100%;
    margin-right: 0.25rem;
    background: var(--color-gray-9);
    transition: 0.1s background;
    padding: 0.5rem;
    font-size: 0.75rem;
    display: inline-flex;

    span {
      margin-right: 0.25rem;
    }

    svg {
      width: 0.75rem;
    }

    &:hover {
      background: var(--color-gray-8);
    }
  }
</style>
