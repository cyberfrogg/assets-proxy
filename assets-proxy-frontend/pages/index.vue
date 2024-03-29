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
      <div :class="$style.appArea">
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
        <section
            :class="[$style.resultPanel, { [$style.resultPanelShown]: resultVideo != null }]"
        >
          <ul :class="$style.resultVideoInfo">
            <li :class="$style.resultVideoInfoRow">
              <div :class="$style.resultVideoInfoRowTitle">VideoID:</div>
              <div :class="$style.resultVideoInfoRowColumnValue">{{ resultVideo ? resultVideo.id : '...' }}</div>
            </li>
            <li :class="$style.resultVideoInfoRow">
              <div :class="$style.resultVideoInfoRowTitle">Stored until:</div>
              <div :class="$style.resultVideoInfoRowColumnValue">{{ resultVideo ? resultVideo.dieAt : '...' }}</div>
            </li>
            <li :class="$style.resultVideoInfoRow">
              <div :class="$style.resultVideoInfoRowTitle">Task status:</div>
              <div :class="$style.resultVideoInfoRowColumnValue">{{ resultVideo ? resultVideo.taskStatus : '...' }}</div>
            </li>
            <li :class="$style.resultVideoInfoRow">
              <div :class="$style.resultVideoInfoRowTitle">Original URL:</div>
              <div :class="$style.resultVideoInfoRowColumnValue">{{ resultVideo ? resultVideo.url : '...' }}</div>
            </li>
          </ul>
          <div :class="$style.resultVideoGet">
            <input
                :class="$style.value"
                placeholder="Result url to use will appear here..."
                :value="resultVideo ? resultVideo.downloadUrl : 'No download url'"
            />
            <button
                :class="$style.copy"
                @click="handleCopyResultValueButtonClick"
            >
              <CopyIcon />
            </button >
            <button
                :class="$style.download"
                @click="handleDownloadButtonClick"
            >
              <DownloadIcon />
            </button>
            <button
                :class="$style.get"
                @click="handleCopyResultValueButtonClick"
            >
              Get Link to Use
            </button>
          </div>
        </section>
        <aside :class="$style.dynamicStatus">
          <DynamicStatusWidget />
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
  import InlineTextScrollContainer from '~/components/promo/inlineTextScrollContainer.vue';
  import Dropdown from '~/components/controls/dropdown.vue';
  import { getVideo, getVideoById, getVideoStatus } from '~/api/video';
  import LoadingIcon from '~/components/icons/loadingIcon.vue';
  import CopyIcon from "~/components/icons/copyIcon.vue";
  import DownloadIcon from "~/components/icons/downloadIcon.vue";
  import SpinnerIcon from "~/components/icons/spinnerIcon.vue";
  import DynamicStatusWidget from "~/components/widgets/dynamicStatusWidget.vue";

  export default {
    components: {
      DynamicStatusWidget,
      SpinnerIcon, DownloadIcon, CopyIcon, LoadingIcon, Dropdown, InlineTextScrollContainer },
    data: () => {
      return {
        formLifetime: '1 hour',
        formUrl: '',
        isInProcess: false,
        currentVideoId: '',
        currentVideoStatus: '',
        currentVideoError: null,
        resultVideo: null
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
        if(this.isInProcess || this.formUrl === '') {
          this.$notify({
            title: "Assets Proxy",
            text: "Url is empty",
          });
          return;
        }

        await this.getVideo({
          url: this.formUrl,
          lifetime: this.formLifetime,
        })
      },
      async getVideo ({ url, lifetime }) {
        this.isInProcess = true;
        this.resultVideo = null;

        try {
          const video = await getVideo({ url, lifetime })
          this.currentVideoId = video.id;
          this.currentVideoStatus = video.taskStatus;

          while (true) {
            try {
              const status = await getVideoStatus({ id: this.currentVideoId });
              this.currentVideoStatus = status.taskStatus;

              if (this.currentVideoStatus === 'online' || this.currentVideoStatus === 'failed') {
                break;
              }
            } catch (es) {
              console.error('Failed to get video status. Retry in next step...', es);
            }
            await sleep(3000);
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
        this.resultVideo = await getVideoById({ id: this.currentVideoId })

        if(this.resultVideo.taskStatus === 'online') {
          this.$notify({
            title: "Assets Proxy",
            text: "Download COMPLETE!",
          });
        }

        if(this.resultVideo.taskStatus === 'failed') {
          this.$notify({
            title: "Assets Proxy",
            text: "Download FAILED!",
          });
        }
      },

      async handleDownloadButtonClick () {
        this.$notify({
          title: "Assets Proxy",
          text: "Download started",
        });

        window.open(this.resultVideo.downloadUrl, '_blank');
      },
      async handleCopyResultValueButtonClick () {
        await navigator.clipboard.writeText(this.resultVideo.downloadUrl);

        this.$notify({
          title: "Assets Proxy",
          text: "Copied to clipboard!",
        });
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
    height: 50px;
  }

  @media all and (max-width: 800px) {
    .topOffset {
      height: 10px;
    }
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
    filter: brightness(120%) contrast(110%);
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

  .resultPanel {
    width: 100%;
    margin-top: 80px;
    opacity: 0;
    pointer-events: none;
    filter: blur(10px);
    transition: 0.2s;
  }

  .resultVideoInfo {
    width: calc(100% - 40px);
    padding: 10px 20px;
    border-radius: 10px;
    background: var(--ap-panel-background-color);
    list-style: none;
  }

  .resultVideoInfoRow {
    width: 100%;
    display: grid;
    grid-template-columns: 150px 1fr;
    grid-gap: 10px;
    margin-bottom: 6px;
  }
  .resultVideoInfo .resultVideoInfoRow:last-of-type {
    margin-bottom: 0;
  }

  .resultVideoInfoRowTitle {
    color: var(--ap-text-gray-color);
  }

  .resultVideoInfoRowValue {
    color: var(--ap-text-color);
  }

  .resultVideoGet {
    width: 100%;
    height: 40px;
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr 40px 40px 180px;
    grid-gap: 10px;
  }

  .resultVideoGet .value {
    width: 100%;
    padding: 0 12px;
    height: 40px;
    background: var(--ap-input-background-color);
    border: 2px solid var(--ap-input-background-color);
    box-sizing: border-box;
    border-radius: var(--ap-controls-radius);
    transition: 0.2s;
  }

  .resultVideoGet .value::placeholder {
    color: var(--ap-input-placeholder-color)
  }

  .resultVideoGet .value:focus{
    border-color: var(--ap-gradient-main-color);
    transition: 0.2s;
  }

  .resultVideoGet .copy {
    background: var(--ap-panel-background-color);
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
  }

  .resultVideoGet .copy:hover {
    background: var(--ap-gradient-main-color);
    transition: 0.1s;
  }

  .resultVideoGet .download {
    background: var(--ap-panel-background-color);
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
  }

  .resultVideoGet .download:hover {
    background: var(--ap-gradient-main-color);
    transition: 0.1s;
  }

  .resultVideoGet .get {
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

  .resultVideoGet .get:hover {
    filter: brightness(120%) contrast(110%);
    transition: 0.1s;
  }

  .resultPanelShown {
    pointer-events: all;
    opacity: 1;
    filter: blur(0px);
    transition: 0.2s;
  }

  @media all and (max-width: 800px) {
    .resultVideoGet {
      height: auto;
      grid-template-rows: auto auto;
      grid-template-columns: 40px 40px 1fr;
    }

    .resultVideoGet .value {
      grid-column: 1 / 4;
      grid-row: 1
    }

    .resultVideoGet .copy {
      grid-row: 2
    }

    .resultVideoGet .download {
      grid-row: 2
    }

    .resultVideoGet .get {
      grid-row: 2
    }
  }

  .dynamicStatus {
    margin: 50px auto 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>