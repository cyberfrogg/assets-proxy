<template>
  <svg :class="$style.icon" width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9962 0.19745C15.9546 1.26885 15.5758 2.25374 14.9631 3.04901C17.3746 4.42692 19 7.02363 19 9.99998C19 14.4183 15.4183 18 11 18C6.58172 18 3 14.4183 3 9.99998C3 7.02364 4.62537 4.42691 7.03693 3.04901C6.42417 2.25374 6.04544 1.26885 6.00383 0.19745C2.44007 2.01746 0 5.72377 0 9.99998C0 16.0751 4.92487 21 11 21C17.0751 21 22 16.0751 22 9.99998C22 5.72377 19.5599 2.01746 15.9962 0.19745Z" fill="#EBEEF9"/>
  </svg>
</template>

<script>
export default {
  name: 'SpinnerIcon',
  components: {}
}
</script>

<style module lang="scss">

.icon {
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