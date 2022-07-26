<script>

  import { fade } from 'svelte/transition';

</script>




<div in:fade="{{ opacity: 80, duration: 250, delay: 200 }}" out:fade="{{ opacity: 80, duration: 250 }}">

  <slot/>
</div>

<style lang="scss">


  div{
    height: 100%;
  }

</style>