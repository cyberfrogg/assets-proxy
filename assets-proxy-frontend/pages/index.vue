<template>
  <div :class="$style.appContainer">
    <div :class="$style.appCenter">
      <div :class="$style.logo">
        <img :class="$style.logoImg" src="~/assets/icons/logo.svg" alt="Assets Proxy Logo"/>
      </div>
      <div :class="$style.promoText">
        <div :class="$style.promoTextText">
          Quick Media for your Watching Experience in
          <InlineTextScrollContainer
            :items="['VRChat', 'Resonite', 'Overte']"
            :width="200"
            :interval="3000"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InlineTextScrollContainer from '~/components/promo/inlineTextScrollContainer.vue';

  export default {
    components: {InlineTextScrollContainer},
  };
</script>

<style module lang="scss">
  .appContainer {
    width: 100%;
  }

  .appCenter {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 125px auto 0;
  }

  .logo {
    width: 100%;
    max-width: 400px;
    padding-bottom: 7.1%;
    position: relative;
  }

  .logoImg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .promoText {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 740px;
    margin-top: 30px;
  }

  .promoTextText {
    text-align: center;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

</style>