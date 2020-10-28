<template>
  <sub-layout title="독서하기" :tooltip="book.title">
    <v-overlay absolute opacity="0.5" :value="finished">
      <div class="finish-overlay">
        <v-icon x-large>mdi-book-open-page-variant</v-icon>
        <h1>다 읽었어요</h1>
        <v-btn dark rounded depressed x-large color="#668d8d">
          독서 완료하기
        </v-btn>
        <v-btn
          dark
          rounded
          depressed
          x-large
          color="#668d8d"
          @click="finished = false"
        >
          더 읽기
        </v-btn>
      </div>
    </v-overlay>
    <flip-book
      v-if="loaded"
      ref="viewer"
      v-slot="viewer"
      class="book-viewer"
      :pages="pages"
      :zooms="null"
      :flip-duration="flipDuration"
      @flip-left-end="onFlip"
      @flip-right-end="onFlip"
    >
      <div class="book-viewer-control">
        <v-btn light icon @click="delayedFlipLeft">
          <v-icon x-large color="#668d8d">mdi-arrow-left-circle</v-icon>
        </v-btn>
        <div class="page-input">
          <v-text-field
            filled
            rounded
            dense
            readonly
            color="#668d8d"
            :value="`${viewer.page} / ${viewer.numPages - 1}`"
          />
        </div>
        <v-btn light icon @click="delayedFlipRight">
          <v-icon x-large color="#668d8d">mdi-arrow-right-circle</v-icon>
        </v-btn>
      </div>
    </flip-book>
  </sub-layout>
</template>

<script>
import FlipBook from 'flipbook-vue';
import _ from 'lodash';
import util from '../util';

export default {
  components: {
    FlipBook,
  },
  data() {
    return {
      flipDuration: 300,
      finished: false,
      pages: [],
      loaded: false,
    };
  },
  computed: {
    book() {
      return this.$store.getters.getCurrentBook;
    },
  },
  watch: {
    async book() {
      this.loaded = false;

      const pages = await Promise.all(
        Array.from(Array(this.book.pageNum).keys())
          .map((k) => `/api/book/${this.book.bid}/${k + 1}`)
          .map(async (url) => util.base64(url)),
      );

      this.pages = [null].concat(pages).concat([null]);

      this.loaded = true;
    },
  },
  async created() {
    this.delayedFlipLeft = _.debounce(this.flipLeft, this.flipDuration);
    this.delayedFlipRight = _.debounce(this.flipRight, this.flipDuration);

    // eslint-disable-next-line global-require
    this.audio = new Audio(require('../assets/wav/page-flip.wav'));

    this.loaded = false;

    const pages = await Promise.all(
      Array.from(Array(this.book.pageNum).keys())
        .map((k) => `/api/book/${this.book.bid}/${k + 1}`)
        .map(async (url) => util.base64(url)),
    );

    this.pages = [null].concat(pages).concat([null]);

    this.loaded = true;
  },
  methods: {
    flipLeft() {
      this.$refs.viewer.flipLeft();
    },
    flipRight() {
      this.$refs.viewer.flipRight();
    },
    onFlip(page) {
      this.audio.play();

      if (page >= this.$refs.viewer.numPages - 1) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },
  },
};
</script>

<style scoped>
.book-viewer {
  width: 100% !important;
  flex: 1;
  display: flex;
  flex-flow: column-reverse;
}

/deep/ .book-viewer .viewport .container {
  padding: 0 !important;
}

.book-viewer-control {
  display: flex;
  height: 10vh;
  padding: 2vh;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}

.book-viewer-control > *:not(:last-child) {
  margin-right: 1vw;
}

/deep/ .page-input {
  width: 20vw;
}

/deep/ .page-input input {
  text-align: center;
}

.finish-overlay {
  display: flex;
  flex-flow: column;
  text-align: center;
}

.finish-overlay > *:not(:last-child) {
  margin-bottom: 2vh;
}
</style>
