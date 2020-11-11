<template>
  <div id="container">
    <v-dialog
      v-model="popup"
      hide-overlay
      width="60vw"
    >
      <div
        class="popup-content"
        :class="{'app-error': popupType === 'error', 'app-success': popupType === 'success'}"
        @click="popup = false"
      >
        <v-img
          v-if="popupType === 'success'"
          src="@/assets/img/layouts/character-correct.png"
          max-width="10vw"
          class="popup-image"
        />
        <v-img
          v-if="popupType === 'error'"
          src="@/assets/img/layouts/character-wrong.png"
          max-width="10vw"
          class="popup-image"
        />
        <div class="popup-message">
          {{ popupMessage }}
        </div>
      </div>
    </v-dialog>
    <div
      id="left-column"
      class="column"
    >
      <slot name="left" />
      <recent-book-items v-if="recentBooks" />
    </div>
    <div
      id="mid-column"
      class="column"
    >
      <slot />
      <v-overlay
        v-show="loadingOverlay"
        absolute
        :value="appLoading"
      >
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>
    </div>
    <div
      id="right-column"
      class="column"
    >
      <div id="menu-title">
        MENU
      </div>
      <div id="menu-items">
        <div class="scroll">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    recentBooks: {
      type: Boolean,
      default: true,
    },
    loadingOverlay: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['popupMessage', 'popupType', 'appLoading']),
    popup: {
      get() { return this.$store.getters.popup; },
      set(value) { this.$store.commit('setPopup', value); },
    },
    popupType() {
      return this.$store.getters.popupType;
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  width: 100vw;
  height: 100vh;
  padding: 2vw;
  display: flex;
  background: linear-gradient(180deg, #a6d6cd 0%, rgba(166, 214, 205, 0) 100%),
    url('~@/assets/img/layouts/background.svg') center bottom/contain no-repeat;
  background-size: contain;
}

#container > .column:not(:last-child) {
  margin-right: 2vw;
}

#left-column {
  display: flex;
  position: relative;
  flex-flow: column;
  width: 6vw;
}

#left-column > *:not(:last-child) {
  margin-bottom: 1vmin;
}

#mid-column {
  display: flex;
  position: relative;
  flex-flow: column;
  width: 78vw;
  height: 100%;
}

#right-column {
  display: flex;
  position: relative;
  flex-flow: column;
  width: 8vw;
}

#menu-title {
  text-align: center;
  font-size: 1.5vw;
  margin: 1vmin 0 1vmin 0;
  color: #ffffff;
}

#menu-items {
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  text-align: center;
  border-radius: 1vmax;
  padding: 1vw;
  background: rgba(255, 253, 242, 0.6);
  overflow-y: scroll;
}

.scroll {
  display: flex;
  flex-flow: column;
}

.popup-content {
  border: 2vw solid #202937;
  background-color: white !important;
  display: flex;
  padding: 2vw;
  justify-content: space-between;
  align-items: center;
  font-size: 2em;

  &.app-success {
    border-color: #8bc673;
  }
  &.app-error {
    border-color: #ee8f89;
  }

  .popup-message {
    flex: 1;
    text-align: center;
    padding-left: 1vw;
  }
}
</style>
