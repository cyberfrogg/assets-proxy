<template>
  <div
      :class="[$style.dropdown, { [$style.dropdownActive]: isActive }]"
      ref="dropdown"
      @click="handleDropdownClick"
  >
    <div :class="$style.selectedItem">
      {{ currentItem }}
    </div>
    <ul :class="$style.list">
      <li
          :class="$style.item"
          v-for="(item, index) in items"
          :key="index"
          @click="handleItemClick(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  data: () => {
    return {
      isActive: false,
      currentItem: ''
    }
  },
  props: {
    items: {
      type: Array,
      default: () => ['sample 1', 'sample 2', 'sample 3', 'sample 4'],
    },
  },
  mounted () {
    this.currentItem = this.items[0];

    document.addEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleDropdownClick () {
      if (!this.isActive) {
        this.isActive = true;
      }
    },
    handleItemClick (item) {
      this.currentItem = item;
      this.$emit('select', item)
      setTimeout(() => { this.isActive = false }, 100);
    },
    handleClickOutside(event) {
      const container = this.$refs.dropdown;
      if (container && !container.contains(event.target)) {
        this.isActive = false;
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style module lang="scss">
  .dropdown {
    width: 100%;
    height: 40px;
    background: var(--ap-input-background-color);
    cursor: pointer;
    border-radius: var(--ap-controls-radius);
    border: 2px solid var(--ap-input-background-color);
    box-sizing: border-box;
    position: relative;
    transition: 0.2s;
    user-select: none;
  }

  .selectedItem {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .list {
    width: calc(100% + 4px);
    position: absolute;
    left: -2px;
    top: calc(100% + 10px);
    list-style: none;
    background: var(--ap-input-background-color);
    border-radius: 10px;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.2));
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    z-index: 100;
  }

  .item {
    text-align: center;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item:hover{
    background: var(--ap-input-background-hover-color);
  }

  .dropdownActive {
    border-color: var(--ap-gradient-main-color);
    transition: 0.2s;
  }

  .dropdownActive .list {
    opacity: 1;
    pointer-events: all;
  }
</style>
