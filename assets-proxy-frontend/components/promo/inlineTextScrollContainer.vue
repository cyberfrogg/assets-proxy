<template>
  <div
      :class="$style.platformsScrollContainer"
      :style="{ width: width + 'px' }"
  >
    <ul
        :class="$style.platformsScroll"
        ref="platformsScroll"
        :style="{ transition: transitionSeconds + 's' }"
    >
      <li
          :class="$style.platformsScrollItem"
          v-for="(item, index) in items"
          :key="index"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "InlineTextScrollContainer",
  data() {
    return {
      intervalId: null,
      distanceToMove: 72,
      currentOffset: 0,
    };
  },
  props: {
    items: {
      type: Array,
      default: () => ['sample 1', 'sample 2', 'sample 3', 'sample 4'],
    },
    interval: {
      type: Number,
      default: 2000
    },
    transitionSeconds: {
      type: Number,
      default: 1
    },
    width: {
      type: Number,
      default: 220
    }
  },
  mounted() {
    this.startMoving();
  },
  methods: {
    moveItemsUp() {
      const platformsScroll = this.$refs.platformsScroll;
      if (platformsScroll) {
        this.currentOffset -= this.distanceToMove;
        platformsScroll.style.transform = `translateY(${this.currentOffset}px)`;

        // Check if reached the end of scrolling, reset to the top
        const maxOffset = (this.items.length) * this.distanceToMove;
        if (Math.abs(this.currentOffset) >= maxOffset) {
          this.currentOffset = 0;
          platformsScroll.style.transform = `translateY(0)`;
        }
      }
    },
    startMoving() {
      this.intervalId = setInterval(this.moveItemsUp, this.interval);
    },
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
};
</script>

<style module lang="scss">
.platformsScrollContainer{
  display: inline-block;
  width: 200px;
  height: 40px;
  overflow: hidden;
  vertical-align: middle;
  list-style: none;
  position: relative;
}

.platformsScroll {
  position: absolute;
  left: 0;
  top: 0;
  list-style: none;
}

.platformsScrollItem{
  text-align: left;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  margin-bottom: 40px;
  height: 32px;

  background: var(--ap-webkit-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
<script setup lang="ts">
</script>