<script>
  import {createEventDispatcher} from 'svelte'
  const dispatch = createEventDispatcher()

  import { find as _find } from 'lodash-es'
  import { buildStaticPage } from '@primo-app/primo/src/stores/helpers'

  export let site
  export let page = _find(site.pages, ['id', 'index'])

  let container
  let iframe
  let loaded = false

  window.addEventListener('message', ({data}) => {
    console.log({data})
    if (data === 'IFRAME_LOADED') {
      resizePreview()
      loaded = true
    }
  })

  let scale = 1
  function resizePreview() {
    if (!container || !iframe) return
    const { clientWidth: parentWidth } = container
    const { clientWidth: childWidth } = iframe
    scale = parentWidth / childWidth
  }

  let preview = ''
  buildStaticPage({
    site,
    page,
    separateModules: false
  }).then(res => (preview = res))

</script>

<svelte:window on:resize={resizePreview} />
<div class="page-thumbnail">
  <div class="iframe-container" bind:this={container} class:fadein={loaded}>
    <iframe
      bind:this={iframe}
      tabindex="-1"
      style="transform: scale({scale})"
      title="site preview"
      srcdoc={preview ? `
        <script>
          window.addEventListener('load', (evt) => {
            parent.postMessage( 'IFRAME_LOADED');
          });
        </script>
      ` + preview : ''}
    />
  </div>
</div>

<style>
  /* reset */
  iframe {
    border: 0; 
  }

  .page-thumbnail {
    position: relative;
    height: 100%;
  }

  .iframe-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.2s;
  }

  iframe {
    width: 100vw;
    height: 1000vh;
    transform-origin: top left;
    pointer-events: none;
  }

  .fadein {
    opacity: 1;
  }
</style>