<script>
  import '$lib/assets/reset.css'
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import { registerProcessors, dropdown } from '@primo-app/primo'
  import user from '../stores/user'
  import { watchForAutoLogin, signOut } from '../supabase/auth'
  import Modal, { show, hide } from '$lib/components/Modal.svelte'
  import * as actions from '../actions'
  import SiteButtons from '$lib/components/SiteButtons.svelte'

  if (browser) {
    import('../compiler/processors').then(({ html, css }) => {
      registerProcessors({ html, css })
    })
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

  watchForAutoLogin(async (event, session) => {
    if (event === 'SIGNED_IN') {
      const { id, email } = session.user
      user.update((u) => ({
        ...u,
        uid: id,
        id,
        // username: username || id,
        email,
        signedIn: true,
      }))
    } else if (event === 'SIGNED_OUT') {
      user.reset()
      goto('/')
    } else if (event === 'PASSWORD_RECOVERY') {
      // passwordResetToken = session.access_token;
    } else {
      console.warn('NEW AUTH EVENT', event)
    }
  })

  $: if (!$user.signedIn) {
    show({
      id: 'AUTH',
      options: {
        disableClose: true,
      },
      props: {
        onSignIn: () => {
          hide()
          actions.sites.initialize()
          actions.hosts.initialize()
        },
      },
    })
  }
</script>

<Modal />
<slot />

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
