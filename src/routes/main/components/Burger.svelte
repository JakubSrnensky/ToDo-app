<script>

  import { fade } from 'svelte/transition';
</script>

<a href="/settings" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}" out:fade="{{ opacity: 80, duration: 250 }}">
  <div class="candle">
    <div class="bar"></div>
    <div class="bar"></div>
  </div>
</a>

<style lang="scss">
  .candle{
    width: 15px;
    height: 15px;
    display: flex;
    flex-wrap: wrap;

    .bar{
      height: 2px;
      width: 20px;
      display: inline-block;
      background-color: #95A0C8;
    }
  }
</style>