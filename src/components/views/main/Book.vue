<template>
  <div class="book">
    <transition>
      <img :src="book.thumbnail" @load="loaded" v-show="isLoaded">
    </transition>
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-show="isLoaded"
    >
      <v-progress-circular
        indeterminate
        color="grey lighten-5"
      />
    </v-row>
    <div
      v-if="clicked"
      class="book-click-overlay"
    >
      <div class="book-click-overlay-icon">
        <v-icon>mdi-book-open-page-variant</v-icon>
      </div>
      <span class="book-click-overlay-text">독서 시작하기</span>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['book', 'clicked'],
  data() {
    return {
      isLoaded: false,
    };
  },
  methods: {
    loaded() {
      this.isLoaded = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.book {
  height: 22vmin;
  width: 18vmin;
  border-radius: 1vmax;
  box-shadow: 0px 15px 10px 0px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  background: #83b1b1;
  transform: translateZ(0);

  img {
    max-width: 18vmin;
    transition: all .3s ease;
  }
  img.v-enter, img.v-leave {
      opacity: 0;
  }
}

.book-click-overlay {
  position: absolute;
  top: 0;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
}

.book-click-overlay-text {
  font-size: 2vmin;
}
</style>
