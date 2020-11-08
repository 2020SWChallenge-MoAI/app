<template>
  <div id="container">
    <v-snackbar
      v-model="popup"
      centered
      rounded="pill"
      :type="popupType"
      timeout="3000"
      @click.native="popup = false"
    >
      <v-icon>mdi-alert-circle</v-icon> {{ popupMessage }}
    </v-snackbar>
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
        <slot name="right" />
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
  },
};
</script>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
  padding: 2vw;
  display: flex;
  background: linear-gradient(180deg, #a6d6cd 0%, rgba(166, 214, 205, 0) 100%),
    url('../../../assets/img/layouts/background.svg') center bottom/contain no-repeat;
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
  margin-bottom: 1vh;
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
  font-size: 2vh;
  margin: 1vh 0 1vh 0;
  color: #ffffff;
}

#menu-items {
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  text-align: center;
  border-radius: 1vw;
  padding: 1vw;
  background: rgba(255, 253, 242, 0.6);
}
</style>
