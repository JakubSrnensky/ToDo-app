<script>
  
  import { fade } from 'svelte/transition';
  import Fa from 'svelte-fa'
  import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

  export let nameButton = null
  export let link = null;
  export let style = null;
  export let color = "";

</script>

  <a href={link} class="back--button {color}" {style} in:fade="{{ opacity: 80, duration: 250, delay: 300 }}">
    {#if nameButton}
      {nameButton}
    {:else}
      <Fa icon={faChevronLeft} />
    {/if}
  </a>

<style lang="scss">

  .back{
    &--button{
      border:2px solid #1F336E;
      width: 40px;
      height: 40px;
      color: #F8FAFF;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      position: relative;
      position: absolute;
      right: 40px;
      top: 40px;

      
      &.dark{
        color: #1F336E;
        border-color: rgb(31, 51, 110, 0.1);
      }
    }
  }
  
</style>