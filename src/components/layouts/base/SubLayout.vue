<template>
  <base-layout :recent-books="recentBooks">
    <template v-slot:left>
      <!-- <left-menu-button
        text="뒤로가기"
        icon="mdi-arrow-left"
        @click.native="$router.back()"
      /> -->
      <left-menu-button
        text="홈으로"
        icon="mdi-home"
        @click.native="$router.replace('/')"
      />
      <slot name="left" />
    </template>
    <template v-slot:right>
      <right-menu-items />
      <slot name="right" />
    </template>
    <div id="content">
      <div id="content-header">
        <span id="title">{{ title }}</span>
        <span id="tooltip">{{ tooltip }}</span>
      </div>
      <div id="content-body">
        <div id="holes">
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
          <div class="hole" />
        </div>
        <div
          id="content-wrapper"
          :class="{scrollable: scrollable}"
        >
          <slot v-if="!appLoading && !appError" />
        </div>
        <v-overlay
          v-show="loadingOverlay"
          absolute
          color="#fffdf2"
          :dark="false"
          :light="true"
          :value="appLoading"
        >
          <v-progress-circular
            indeterminate
            size="64"
          />
        </v-overlay>
        <v-overlay
          absolute
          color="#fffdf2"
          opacity="1.0"
          :dark="false"
          :light="true"
          :value="appError"
        >
          <div class="error-overlay">
            <v-img
              src="@/assets/noBooks.png"
              height="30vh"
              contain
            />
            <h1>{{ errorMessage }}</h1>
          </div>
        </v-overlay>
      </div>
    </div>
  </base-layout>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
    recentBooks: {
      type: Boolean,
      default: true,
    },
    loadingOverlay: {
      type: Boolean,
      default: true,
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    appLoading() {
      return this.$store.getters.appLoading;
    },
    appError() {
      return this.$store.getters.appError;
    },
    errorMessage() {
      return this.$store.getters.errorMessage;
    },
  },
};
</script>

<style lang="scss" scoped>
#content {
  position: relative;
  flex: 1;
  display: flex;
  flex-flow: column;
  width: 100%;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 1vw;
  overflow: hidden;
  padding: 1vw;
}

#content-header {
  display: flex;
  justify-content: space-between;
}

#title {
  min-width: 20vw;
  background-color: #ee8f89;
  padding: 1vh 0 0 0;
  border-radius: 1vw 1vw 0 0;
  text-align: center;
  font-size: 3vh;
  margin-left: 1vw;
  color: white;
}

#tooltip {
  background: #ffffff;
  padding: 1vh 1vw 1vh 1vw;
  margin-bottom: 1vw;
  font-size: 2vh;
  border-radius: 1vw;
  text-align: center;
  min-width: 50%;
  align-self: flex-end;
  display: block;
}

#content-body {
  width: 100%;
  flex: 1;
  border-radius: 1vw;
  background: #fffdf2;
  position: relative;
  padding: 1vw;
  display: flex;
  flex-flow: column;
  min-height: 0;
}

#content-wrapper {
  width: 100%;
  display: flex;
  flex-flow: column;
  flex: 1;

  &.scrollable {
    overflow-y: scroll;
  }
}

#holes {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1vw;
  z-index: 10;
}

#holes > .hole:not(:last-child) {
  margin-right: 2vw;
}

.hole {
  width: 2vw;
  height: 2vw;
  background: #d2eade;
  border-radius: 100%;
}

.error-overlay {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
</style>
