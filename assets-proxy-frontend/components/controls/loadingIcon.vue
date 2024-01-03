<template>
  <div :class="$style.loading">
    <div :class="$style.icon">...</div>
  </div>
</template>

<script>
import LoadingIconSvg from 'assets/icons/loading.svg?inline';

export default {
  name: 'LoadingIcon',
  components: {
    LoadingIconSvg
  }
}
</script>

<style module lang="scss">
  .loading {
    position: relative;
  }

  .icon {
    width: 30px;
    height: 30px;
    animation: rotate 4s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>