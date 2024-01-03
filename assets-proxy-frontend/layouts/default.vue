<template>
  <div :class="$style.mainContainer">
    <div :class="$style.content">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style module lang="scss">
  .mainContainer {
    width: 100%;
    min-height: 100vh;
  }

  .content {
    width: 100%;
    min-height: calc(100vh - 70px);
  }
</style>
