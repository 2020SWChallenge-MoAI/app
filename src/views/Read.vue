<template>
  <sub-layout
    title="독서하기"
    :tooltip="`${josa.r(book.title, '을/를')} 재미있게 읽어 보자!`"
  >
    <v-overlay absolute opacity="0.5" :value="finished">
      <div class="finish-overlay">
        <v-icon x-large>mdi-book-open-page-variant</v-icon>
        <h1>다 읽었어요</h1>
        <v-btn
          dark
          rounded
          depressed
          x-large
          color="#668d8d"
          @click="readFinishPopup = true"
        >
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
    <v-dialog v-model="readFinishPopup" width="50vw">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Privacy Policy
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="readFinishPopup = false">
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <flip-book
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

export default {
  components: {
    FlipBook,
  },
  data() {
    return {
      bid: parseInt(this.$route.params.bid, 10),
      book: null,
      pages: [
        null,
        '/img/sample/0_bomul.pdf.jpg',
        '/img/sample/1_bomul.pdf.jpg',
        '/img/sample/2_bomul.pdf.jpg',
        '/img/sample/3_bomul.pdf.jpg',
        '/img/sample/4_bomul.pdf.jpg',
        '/img/sample/5_bomul.pdf.jpg',
        '/img/sample/6_bomul.pdf.jpg',
        '/img/sample/7_bomul.pdf.jpg',
        '/img/sample/8_bomul.pdf.jpg',
        '/img/sample/9_bomul.pdf.jpg',
        '/img/sample/10_bomul.pdf.jpg',
        '/img/sample/11_bomul.pdf.jpg',
        '/img/sample/12_bomul.pdf.jpg',
        '/img/sample/13_bomul.pdf.jpg',
        '/img/sample/14_bomul.pdf.jpg',
        '/img/sample/15_bomul.pdf.jpg',
        '/img/sample/16_bomul.pdf.jpg',
        '/img/sample/17_bomul.pdf.jpg',
        '/img/sample/18_bomul.pdf.jpg',
        '/img/sample/19_bomul.pdf.jpg',
        '/img/sample/20_bomul.pdf.jpg',
        '/img/sample/23_bomul.pdf.jpg',
        '/img/sample/24_bomul.pdf.jpg',
        '/img/sample/25_bomul.pdf.jpg',
        null,
      ],
      flipDuration: 300,
      finished: false,
      readFinishPopup: false,
    };
  },
  created() {
    // eslint-disable-next-line prefer-destructuring
    this.book = this.$store.getters.getBook(this.bid);

    this.delayedFlipLeft = _.debounce(this.flipLeft, this.flipDuration);
    this.delayedFlipRight = _.debounce(this.flipRight, this.flipDuration);

    // eslint-disable-next-line global-require
    this.audio = new Audio(require('../assets/wav/page-flip.wav'));
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
