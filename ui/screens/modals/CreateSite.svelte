<script>
  import {slide} from 'svelte/transition'
  import {createEventDispatcher} from 'svelte'
  const dispatch = createEventDispatcher()

  import svg from '../../assets/svg'
  import PageThumbnail from '../../components/PageThumbnail.svelte'
  import { Site } from '@primo-app/primo/src/const'
  import {validateSiteStructure} from '@primo-app/primo/src/utils'

  let siteName = ''
  $: siteID = siteName.replace(/\s+/g, '-').replace(/[^0-9a-z\-._]/ig, '').toLowerCase()

  let site = Site()

  let duplicating = false
  function createSite() {
    dispatch('create', {
      ...site,
      name: siteName,
      id: siteID
    })
  }

  function uploadSiteFile({target}) {
    var reader = new window.FileReader()
    reader.onload = async function ({ target }) {
      if (typeof target.result !== 'string') return
      const uploaded = JSON.parse(target.result)
      const converted = validateSiteStructure(uploaded)
      if (converted) site = converted
      else duplicateFileIsValid = false
      duplicating = true
    }
    reader.readAsText(target.files[0])
  }
</script>

<form on:submit|preventDefault={createSite}>
  <div class="text-input">
    <span>Site Name</span>
    <input bind:value={siteName} type="text" autofocus>
  </div>
  <div class="text-input">
    <span>Site ID</span>
    <input bind:value={siteID} type="text">
  </div>
  {#if duplicating}
    <div class="duplicate-preview" in:slide>
      <PageThumbnail {site} />
    </div>
  {/if}
  <button class="primary-button">
    <span>Create { duplicating ? 'duplciate' : 'blank' } site</span>
    {@html svg.chevron}
  </button>
  <footer>
    <label class="footer-button">
      <input
        on:change={uploadSiteFile}
        type="file"
        id="primo-json"
        accept=".json"
      />
      {@html svg.upload}
      <span>Duplicate from primo.json</span>
    </label>
    <div class="hint">
      {@html svg.info}
      <div>
        <span>Create your new site from a primo site file <a target="blank" href="https://docs.primo.af">Learn More</a></span>
      </div>
    </div>
  </footer>
</form>

<style lang="postcss">
  form {
    display: grid;
    gap: 1rem;
  }

  :global(svg) {
    width: 1rem;
  }

  .duplicate-preview {
    width: 100%;
    aspect-ratio: 1.6;
    background: var(--color-bg-1); /* variable - dark */
  }

  footer {
    display: flex;
    justify-content: flex-start;
  }

  /* Export to component */ 

  .text-input {
    display: flex;
    flex-direction: column;

    span {
      color: var(--color-text-5);
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }

    input {
      color: var(--color-text-1); 
      border-radius: var(--border-radius);
      background: var(--color-bg-3);
      padding: 0.75rem;
      box-shadow: 0px 0px 0px 2px transparent;
      transition: box-shadow 0.1s;

      &:focus {
        box-shadow: 0px 0px 0px 2px var(--color-focus);
      }
    }
  }

  .primary-button {
    background: var(--color-accent); 
    padding: 0.75rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius);
    transition: background 0.1s;

    span {
      color: var(--color-text-1);
      font-weight: 700;
      font-size: 0.825rem;
      margin-right: 0.5rem;
    }

    :global(svg) {
      height: 1rem
    }

    &:focus {
      box-shadow: 0px 0px 0px 2px var(--color-focus);
    }

    &:hover {
      background: var(--color-hover);
    }
  }

  .footer-button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-self: flex-start;
    color: var(--color-text-4);
    transition: color 0.1s;

    input {
      display: none;
    }

    span {
      font-size: 0.75rem;
      margin-right: 0.5rem;
    }

    :global(svg) {
      height: 0.875rem;
      margin-right: 0.25rem;
    }

    &:hover {
      color: var(--color-hover); 
    }
  }

  .hint {
      position: relative;
      transform: translateY(-4px);

      :global(svg) {
        color: var(--color-text-4);
        height: 0.5rem;
        width: 0.5rem;
      }

      &:hover div {
        opacity: 1;
        pointer-events: all;
      }

      div {
        top: 0;
        left: 0;
        width: 10rem;
        padding: 1rem;
        position: absolute;
        pointer-events: none;
        opacity: 0;
      }

      span {
        display: block;
        background: var(--color-bg-3);
        width: 100%;
        font-size: 0.75rem;
        color: var(--color-text-2);
        padding: 1rem;
        transition: opacity 0.1s;

        a {
          padding-left: 0.25rem;
          color: var(--color-text-2);
        }
      }
    }

</style>