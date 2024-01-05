<template>
  <div :class="$style.footer">
    <ul :class="$style.footerList">
      <li :class="$style.footerListItem">
        <NuxtLink :to="'https://cyberfrogg.com/'">
          <FrogIcon />
          made by cyberfrogg
        </NuxtLink>
      </li>
      <li :class="$style.footerListItem">
        <NuxtLink :to="'https://discord.com/invite/esHDJNZeDy'">
          <DiscordIcon />
          join discord server
        </NuxtLink>
      </li>
      <li :class="$style.footerListItem">
        <NuxtLink :to="'https://github.com/cyberfrogg/assets-proxy'">
          <GithubIcon />
          github
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<style module lang="scss">
  .footer {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footerList {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footerListItem {
    margin: 0 20px;
    text-decoration: none;
  }

  .footerListItem a {
    text-decoration: none;
    color: var(--ap-text-gray-color);
    display: flex;
    transition: 0.2s;
  }

  .footerListItem a svg {
    vertical-align: middle;
    margin-right: 10px;
  }

  .footerListItem a svg * {
    transition: 0.2s;
  }

  .footerListItem:hover a {
    color: var(--ap-text-color);
    transition: 0.2s;
  }

  .footerListItem:hover a svg *{
    fill: var(--ap-text-color);
    transition: 0.2s;
  }

  @media all and (max-width: 800px) {
    .footer {
      padding-top: 20px;
      padding-bottom: 20px;
      height: auto;
    }

    .footerList {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 20px;
    }
  }
</style>
<script setup lang="ts">
import FrogIcon from "~/components/icons/frogIcon.vue";
import DiscordIcon from "~/components/icons/discordIcon.vue";
import GithubIcon from "~/components/icons/githubIcon.vue";
</script>