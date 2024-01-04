<template>
  <div :class="$style.appContainer">
    <div :class="$style.topOffset"></div>
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
      <section :class="$style.appArea">
        <form :class="$style.requestForm">
          <input
              :class="$style.urlInputField"
              placeholder="Insert website url where to video download from..."
              @input="handleUrlChange"
          />
          <Dropdown
            :items="['1 hour', '1 day', '1 week', '1 month']"
            @select="handleLifetimeSelect"
          />
          <button
              :class="$style.submitButton"
              @click.prevent="handleFormSubmit"
              :disabled="isInProcess"
          >

            <LoadingIcon
                v-if="isInProcess"
                :class="$style.loading"
            />
            <div
                v-else
                :class="$style.text"
            >Get Video</div>
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
  import InlineTextScrollContainer from '~/components/promo/inlineTextScrollContainer.vue';
  import Dropdown from '~/components/controls/dropdown.vue';
  import { getVideo, getVideoStatus } from '~/api/video';
  import LoadingIcon from "~/components/controls/loadingIcon.vue";

  export default {
    components: {LoadingIcon, Dropdown, InlineTextScrollContainer},
    data: () => {
      return {
        formLifetime: '1 hour',
        formUrl: '',
        isInProcess: false,
        currentVideoId: '',
        currentVideoStatus: '',
        currentVideoError: null,
      }
    },
    methods: {
      handleLifetimeSelect (item) {
        this.formLifetime = item;
      },
      handleUrlChange (event) {
        this.formUrl = event.target.value;
      },
      async handleFormSubmit () {
        if(this.isInProcess || this.formUrl === '')
          return;

        await this.getVideo({
          url: this.formUrl,
          lifetime: this.formLifetime,
        })
      },
      async getVideo ({ url, lifetime }) {
        this.isInProcess = true;
        try {
          const video = await getVideo({ url, lifetime })
          this.currentVideoId = video.id;
          this.currentVideoStatus = video.taskStatus;

          while (this.currentVideoStatus !== 'complete') {
            try {
              const status = await getVideoStatus({ id: this.currentVideoId });
              this.currentVideoStatus = status.taskStatus;
            } catch (es) {
              console.error('Failed to get video status. Retry in next step...', es);
            }
            await sleep(5000);
          }

          await this.handleVideoCompleteStatus();
        } catch (e) {
          console.error('Failed to get video', e);
          this.currentVideoError = 'Error occurred while downloading video.'
          this.isInProcess = false;
        }
      },

      async handleVideoCompleteStatus () {
        this.isInProcess = false;
      }
    }
  };
</script>

<style module lang="scss">
  .appContainer {
    width: calc(100% - 40px);
    padding: 0 20px;
  }

  .topOffset{
    height: 125px;
  }

  .appCenter {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 auto 0;
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

  .appArea {
    width: 100%;
    max-width: 900px;
    margin-top: 100px;
  }

  .requestForm {
    width: 100%;
    height: 40px;
    display: grid;
    grid-template-columns: 1fr 110px 130px;
    grid-gap: 10px;
  }

  .urlInputField {
    width: 100%;
    padding: 0 12px;
    height: 40px;
    background: var(--ap-input-background-color);
    border: 2px solid var(--ap-input-background-color);
    box-sizing: border-box;
    border-radius: var(--ap-controls-radius);
    transition: 0.2s;
  }

  .urlInputField:focus{
    border-color: var(--ap-gradient-main-color);
    transition: 0.2s;
  }

  .urlInputField::placeholder {
    color: var(--ap-input-placeholder-color)
  }

  .submitButton {
    width: 100%;
    height: 40px;
    background: var(--ap-gradient);
    border-radius: 10px;
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;
    transition: 0.2s;
    position: relative;
  }

  .submitButton:hover {
    filter: brightness(120%);
    transition: 0.1s;
  }

  .submitButton:disabled {
    background: var(--ap-button-disabled-gradient);
    filter: none;
    cursor: not-allowed;
    transition: 0.2s;
  }

  .submitButton .loading{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  @media all and (max-width: 800px) {
    .logo{
      padding-bottom: 20%;
    }

    .requestForm {
      grid-template-columns: 1fr;
      height: auto;
    }
  }

</style>