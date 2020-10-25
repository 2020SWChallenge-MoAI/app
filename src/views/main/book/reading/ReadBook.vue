<template>
  <sub-layout>
    <div class="book-title">
      {{ book.title }}
    </div>
    <flip-book
      ref="viewer"
      v-slot="viewer"
      class="book-viewer"
      :pages="pages"
      :zooms="null"
      :flip-duration="flipDuration"
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
            :value="`${viewer.page} / ${viewer.numPages}`"
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
    };
  },
  methods: {
    flipLeft() {
      this.$refs.viewer.flipLeft();
    },
    flipRight() {
      this.$refs.viewer.flipRight();
    },
  },
  created() {
    // eslint-disable-next-line prefer-destructuring
    this.book = this.$store.getters.getBook(this.bid);

    this.delayedFlipLeft = _.debounce(this.flipLeft, this.flipDuration);
    this.delayedFlipRight = _.debounce(this.flipRight, this.flipDuration);
  },
};
</script>

<style scoped>
.book-title {
  padding: 2vh;
  margin: 2vh;
  border-radius: 1vw;
  background: #ffffff;
  text-align: center;
  font-size: 3vh;
}

.book-viewer {
  width: 78vw !important;
}

/deep/ .book-viewer .viewport {
  width: 78vw !important;
  height: calc(100vh - 6vw - 11vh - 10vh) !important;
}

/deep/ .book-viewer .viewport .container {
  padding: 0 !important;
}

/deep/ .container {
  max-width: 100%;
}

.book-viewer-control {
  display: flex;
  height: 10vh;
  padding: 2vh;
  align-items: flex-start;
  justify-content: center;
  position: absolute;
  bottom: 0;
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
</style>
