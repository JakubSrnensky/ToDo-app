<script>
  import { fade } from 'svelte/transition';
</script>

  <div
    in:fade="{{ opacity: 50, duration: 250, delay: 300 }}"
    out:fade="{{ opacity: 50, duration: 250 }}" 
    >
    <slot/>
  </div>

  <style>
    div{
      width: 100%;
    }
  </style>