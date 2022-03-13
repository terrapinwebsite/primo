<script>
  import { processCode, convertFieldsToData } from '../utils';
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()

  export let field;
  export let fields;
  export let onChange;

  onChange = () => {
    buildComponent(field.value);
  };

  let c;
  async function buildComponent(source) {
    if (fieldValue === source) return
    const data = convertFieldsToData(fields);
    const res = await processCode({
      code: {
        html: source,
        css: '',
        js: '',
      },
      data,
      buildStatic: false,
    });
    const blob = new Blob([res.js], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);

    import(url).then(({ default: App }) => {
      if (c) c.$destroy();
      try {
        c = new App({
          target: element,
          props: data,
        });
        c.$on('update', e => {
          fields[0].value = e.detail
          dispatch('input')
        })
      } catch (e) {
        console.error(e.toString());
      }
    });
    fieldValue = source
  }

  let fieldValue
  $: buildComponent(field.value);

  let element;

</script>

<div bind:this={element} />
