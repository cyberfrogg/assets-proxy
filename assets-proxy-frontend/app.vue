<template>
  <NuxtNotifications classes="genericNotification" position="bottom right" :speed="500" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
  .genericNotification {
    background: var(--ap-panel-background-color) !important;
    margin-bottom: 20px;
    margin-right: 20px;
    padding: 10px 20px;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.25));
    border-radius: 10px;

    .notification-title {
      margin-bottom: 5px;
      color: var(--ap-text-gray-color);
      font-weight: 500;
    }

    .notification-content {
      font-weight: 500;
    }

    &.success {

    }
    &.info {

    }
    &.error {

    }
  }
</style>