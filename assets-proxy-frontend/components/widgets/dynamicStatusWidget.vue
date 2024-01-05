<template>
  <div :class="$style.dynamicStatus">
    <ul :class="$style.dynamicStatusTable">
      <li :class="$style.dynamicStatusRow">
        <SpinnerIcon :class="$style.spinner"/>
        <div :class="$style.title">videos pending:</div>
        <div :class="$style.value">{{ isPreviousRequestSuccessful ? pendingVideosCount : '-' }}</div>
      </li>
      <li :class="$style.dynamicStatusRow">
        <SpinnerIcon :class="$style.spinner"/>
        <div :class="$style.title">videos online:</div>
        <div :class="$style.value">{{ isPreviousRequestSuccessful ? onlineVideosCount : '-' }}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import SpinnerIcon from "~/components/icons/spinnerIcon.vue";
import { dynamicStatus } from "~/api/status";

export default {
  name: "DynamicStatusWidget",
  components: { SpinnerIcon },
  data() {
    return {
      isPreviousRequestSuccessful: true,
      pendingVideosCount: 0,
      onlineVideosCount: 0
    };
  },
  mounted() {
    this.updateStatus();
    this.interval = setInterval(this.updateStatus, 2000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async updateStatus() {
      try {
        const statusApiResponse = await dynamicStatus();
        this.pendingVideosCount = statusApiResponse.pendingVideosCount;
        this.onlineVideosCount = statusApiResponse.onlineVideosCount;
        this.isPreviousRequestSuccessful = true;
      } catch (e) {
        this.isPreviousRequestSuccessful = false;
      }
    }
  }
}
</script>
<style module lang="scss">
  .dynamicStatus {
    width: 230px;
    background: var(--ap-background-color);
    border-radius: 10px;
    padding: 5px 15px;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.15));
  }

  .dynamicStatusTable {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    list-style: none;
  }

  .dynamicStatusRow {
    width: 100%;
    display: grid;
    grid-template-columns: 15px 1fr 40px;
    grid-gap: 10px;
    margin-bottom: 5px;
  }

  .dynamicStatusTable .dynamicStatusRow:last-of-type {
    margin-bottom: 0;
  }

  .dynamicStatusRow .spinner {
    width: 15px;
    height: 15px;
    align-self: center;
    color: var(--ap-text-gray-color);
  }

  .dynamicStatusRow .spinner * {
    fill: var(--ap-text-gray-color);
  }

  .dynamicStatusRow .title {
    color: var(--ap-text-gray-color);
  }

  .dynamicStatusRow .value {
    color: var(--ap-text-gray-color);
    text-align: right;
  }
</style>