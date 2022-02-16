<script context="module">
  import {writable} from 'svelte/store'
  const visible = writable(false)

  export const type = writable({
    id: null,
    props: {},
  })

  export function show(t) {
    visible.set(true)
  }
</script>

<script>
  import {fade} from 'svelte/transition'
  import svg from '../../assets/svg'

  export let title 
</script>

{#if $visible}
  <div class="primo--modal-container primo-reset" transition:fade={{ duration: 100 }}>
    <div class="primo--modal-background" on:click={() => $visible = false}></div>
    <div class="primo--modal">
      {#if title}
        <header>
          <button on:click={() => $visible = false}>
            {@html svg.x}
          </button>
          <div class="title">
            <span>{@html svg[title.icon]}</span>
            <span>{title.label}</span>
          </div>
        </header>
      {/if}
      <slot>
        modal content
      </slot>
    </div>
  </div>
{/if}

<style lang="postcss">
  .primo--modal-container {
    position: fixed;
    z-index: 99999;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.9);
  }

  .primo--modal-background {
    position: absolute;
    inset: 0;
  }

  .primo--modal {
    padding: 1.5rem;
    width: 100%;
    max-width: 500px;
    background: var(--color-bg-2);
    border-radius: var(--border-radius);
    z-index: 1;
  }

  header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    margin-bottom: 2rem;

    :global(svg) {
      width: 1rem;
    }

    button {
      color: var(--color-text-3);
      justify-self: flex-start;
    }

    .title {
      color: var(--color-text-2);
      font-weight: bold;
      font-size: 1.125rem;

      :global(svg) {
        margin-right: 0.5rem;
      }
    }
  }
</style>
