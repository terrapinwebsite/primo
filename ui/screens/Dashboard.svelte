<script lang="ts">
  import {createEventDispatcher} from 'svelte'
  const dispatch = createEventDispatcher()
  
  import svg from '../assets/svg'
  import PageThumbnail from '../components/PageThumbnail.svelte'

  export let sites

  // accept sites
  // dispatch events for modifying sites
  // pass in toolbar buttons

</script>

<div class="dashboard">
  <header>
    {@html svg.logo()}
    <nav>
      <a href="/docs">
        {@html svg.book()}
        <span>Docs</span>
      </a>
      <a href="/settings">
        {@html svg.gear()}
        <span>Settings</span>
      </a>
    </nav>
  </header>
  <main>
    <ul>
      {#each sites as site}
        <li class="site-item">
          <div class="preview">
            <PageThumbnail {site} />
          </div>
          <div class="controls">
            <div class="site-name">
              <span>Hero</span>
              <button on:click={() => dispatch('edit', site)}>{@html svg.notepad()}</button>
            </div>
            <footer>
              <span class="site-id">site-id-here</span>
              <button on:click={() => dispatch('delete', site)}>
                {@html svg.trash()}
              </button>
            </footer>
          </div>
        </li>
      {/each}
      <li>
        <button on:click={() => dispatch('create')} id="create-site">
          {@html svg.plus()}
          <span>create a site</span>
        </button>
      </li>
    </ul>
  </main>
</div>

<style lang="postcss">

  /* resets */

  li {
    list-style: none;
  }

  button {
    border: 0;
    background: transparent;
  }

  * {
    font-family: 'Satoshi';
  }



  .dashboard {
    min-height: 100vh;
    background: var(--primo-color-black);
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

      a {
        font-weight: bold;
        text-decoration: none; /* reset */
        font-family: 'Satoshi'; /* reset */
        color: #D7D9DA; /* variable */
        display: flex; 
        justify-content: center;

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
      margin: 0; /* reset */
      padding: 0; /* reset */
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;

      li.site-item {
        border-radius: 4px; /* variable */
        overflow: hidden;

        .preview {
          aspect-ratio: 1.6;
          background: white;
        }

        .controls {
          background: #242526; /* variable */
          padding: 1rem;

          .site-name {
            color: #E2E4E9; /* variable */
            font-weight: 500;
          }

          footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .site-id {
              font-size: 0.875rem;
              color: #A2A6A9; /* variable */
            }
          }
        }

        :global(svg) {
          width: 0.875rem;
        }
      }

      button#create-site {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 0;
        border-radius: 4px; /* variable */
        background: #323334; /* variable */
        width: 100%;
        height: 100%;

        span {
          color: #BEBFC0; /* variable */
          font-weight: bold;
          font-family: 'Satoshi'; /* reset */
        } 

        :global(svg) {
          width: 1rem;
          margin-bottom: 0.5rem;
        }
      }
    }
  }
</style>
