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
        <section :class="$style.resultPanel">
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
            />
            <button :class="$style.copy">
              <CopyIcon />
            </button>
            <button :class="$style.download">
              <DownloadIcon />
            </button>
            <button :class="$style.get">
              Get Link to Use
            </button>
          </div>
        </section>
        <aside :class="$style.serviceStatus">
          <ul :class="$style.serviceStatusTable">
            <li :class="$style.serviceStatusRow">
              <SpinnerIcon :class="$style.spinner"/>
              <div :class="$style.title">videos pending:</div>
              <div :class="$style.value">0</div>
            </li>
            <li :class="$style.serviceStatusRow">
              <SpinnerIcon :class="$style.spinner"/>
              <div :class="$style.title">videos online::</div>
              <div :class="$style.value">0</div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
  import InlineTextScrollContainer from '~/components/promo/inlineTextScrollContainer.vue';
  import Dropdown from '~/components/controls/dropdown.vue';
  import { getVideo, getVideoStatus } from '~/api/video';
  import LoadingIcon from '~/components/icons/loadingIcon.vue';
  import CopyIcon from "~/components/icons/copyIcon.vue";
  import DownloadIcon from "~/components/icons/downloadIcon.vue";
  import SpinnerIcon from "~/components/icons/spinnerIcon.vue";

  export default {
    components: {SpinnerIcon, DownloadIcon, CopyIcon, LoadingIcon, Dropdown, InlineTextScrollContainer },
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

  .serviceStatus {
    width: 250px;
    background: var(--ap-background-color);
    border-radius: 10px;
    margin: 50px auto 0;
    padding: 5px 15px;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.15));
  }

  .serviceStatusTable {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .serviceStatusRow {
    width: 100%;
    display: grid;
    grid-template-columns: 15px 1fr 40px;
    grid-gap: 10px;
    margin-bottom: 5px;
  }

  .serviceStatusTable .serviceStatusRow:last-of-type {
    margin-bottom: 0;
  }

  .serviceStatusRow .spinner {
    width: 15px;
    height: 15px;
    align-self: center;
    color: var(--ap-text-gray-color);
  }

  .serviceStatusRow .spinner * {
    fill: var(--ap-text-gray-color);
  }

  .serviceStatusRow .title {
    color: var(--ap-text-gray-color);
  }

  .serviceStatusRow .value {
    color: var(--ap-text-gray-color);
    text-align: right;
  }
</style>