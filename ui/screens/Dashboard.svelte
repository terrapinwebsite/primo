<script>
  import {createEventDispatcher} from 'svelte'
  const dispatch = createEventDispatcher()
  
  import Modal, {show} from './modals/Modal.svelte'
  import CreateSite from './modals/CreateSite.svelte'
  import svg from '../assets/svg'
  import PageThumbnail from '../components/PageThumbnail.svelte'

  export let buttons
  export let sites

  let siteBeingEdited = null

</script>

<Modal title={{
  icon: 'plus',
  label: 'Create a Site'
}}>
  <CreateSite on:create />
</Modal> 

<div class="dashboard primo-reset">
  <header>
    {@html svg.logo}
    <nav>
      {#each buttons as button}
        <button on:click={button.onclick}>
          {@html svg[button.icon]}
          <span>{button.label}</span>
        </button>
      {/each}
    </nav>
  </header>
  <main>
    <ul>
      {#each sites as site}
        <li class="site-item">
          <button class="preview">
            <PageThumbnail {site} />
          </button>
          <div class="controls">
            <div class="site-name">
              {#if siteBeingEdited === site.id}
                <input type="text" autofocus bind:value={site.name} on:change={() => dispatch('edit', site)}>
              {:else}
                <span>{site.name}</span>
                <button on:click={() => siteBeingEdited = site.id}>{@html svg.notepad}</button>
              {/if}
            </div>
            <footer>
              <span class="site-id">{site.id}</span>
              <button on:click={() => dispatch('delete', site)}>
                {@html svg.trash}
              </button>
            </footer>
          </div>
        </li>
      {/each}
      <li>
        <button on:click={() => show()} id="create-site">
          {@html svg.plus}
          <span>create a site</span>
        </button>
      </li>
    </ul>
  </main>
</div>

<style lang="postcss">



  .dashboard {
    min-height: 100vh;
    background: #18191A; /* variable */
    padding: 3rem;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3rem;

    :global(svg.logo) {
      width: 7rem;
    }

    nav {
      display: flex;

      button {
        font-weight: bold;
        color: var(--color-text-5); /* variable */
        display: flex; 
        justify-content: center;
        align-items: center;

        :global(svg) {
          width: 1rem;
          margin-right: 0.5rem;
        }

        &:not(:last-child) {
          margin-right: 1.5rem;
        }

      }
    }
  }

  main {
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;

      li.site-item {
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius);
        overflow: hidden;

        .preview {
          width: 100%;
          aspect-ratio: 1.6;
          background: white;
        }

        .controls {
          background: var(--color-bg-2); 
          padding: 1rem;

          .site-name {
            color: var(--color-text-2);
            font-weight: 500;
          }

          footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .site-id {
              font-size: 0.875rem;
              color: var(--color-text-3);
            }
          }
        }

        :global(svg) {
          color: var(--color-text-2);
          width: 0.875rem;

          &:hover {
            color: var(--color-hover);
          }
        }
      }

      button#create-site {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 0;
        border-radius: var(--border-radius);
        background: var(--color-bg-3);
        transition: 0.1s background;
        width: 100%;
        height: 100%;

        &:hover {
          background: #4B4D4E; /* variable */
        }

        span {
          color: var(--color-text-4); 
          font-weight: bold;
        } 

        :global(svg) {
          width: 1rem;
          margin-bottom: 0.5rem;
        }
      }
    }
  }
</style>
