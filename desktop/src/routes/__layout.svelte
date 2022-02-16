<script>
  import { browser } from '$app/env'
  import ImageField from '../extensions/FieldTypes/ImageField.svelte'
  import SiteButtons from '$lib/components/SiteButtons.svelte'
  import {
    dropdown,
    registerProcessors,
    fieldTypes,
    PrimoFieldTypes,
  } from '@primo-app/primo'
  import * as primo from '@primo-app/primo/package.json'
  import * as desktop from '../../package.json'

  if (browser) {
    import('../compiler/processors').then(({ html, css }) => {
      registerProcessors({ html, css })
    })

    fieldTypes.register([
      {
        id: 'image',
        label: 'Image',
        component: ImageField,
      },
      ...PrimoFieldTypes,
    ])

    dropdown.set([
      {
        label: 'Back to Dashboard',
        icon: 'fas fa-arrow-left',
        href: '/',
      },
      {
        component: SiteButtons,
      },
    ])
  }
</script>

<div id="primo-desktop-toolbar" />
<slot />
<div id="app-version">
  <span>desktop v{desktop.version}</span>
  <span>primo v{primo.version}</span>
</div>

<style global lang="postcss">

  .primo-reset {
    font-family: 'Satoshi';


    --color-accent: #EE4645;

    --color-bg-1: #18191A;
    --color-bg-2: #242526;
    --color-bg-3: #3E4041;

    --color-text-1: #FFFFFF;
    --color-text-2: #E2E4E9;
    --color-text-3: #A2A6A9;
    --color-text-4: #BEBFC0;
    --color-text-5: #D7D9DA;

    --color-focus: #BEBFC0;
    --color-hover: #F16A69;

    --border-radius: 4px;



    /* resets */

    ul {
      margin: 0; /* reset */
      padding: 0; /* reset */
    }

    li {
      list-style: none;
    }

    button {
      border: 0;
      background: transparent;
      padding: 0;
      cursor: pointer;

      &:focus {
        outline: 0;
      }
    }

    input {
      border: 0;

      &:focus {
        outline: 0;
      }
    }

    body {
      margin: 0;
    }
  }

</style>
