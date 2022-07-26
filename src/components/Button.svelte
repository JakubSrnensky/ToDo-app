<script>
  
  import { fade } from 'svelte/transition';
  
  export let nameButton = null;
  export let custom = "";
  export let link = null;
  export let style = null;

</script>

  <a href={link} class="button {custom}" {style}  in:fade="{{ opacity: 80, duration: 250, delay: 200 }}" out:fade="{{ opacity: 80, duration: 250 }}">
    {nameButton}
  </a>

<style lang="scss">

 .button  {
    border: 0;
    text-decoration:none;
    font-size: 25px;
  }

</style>