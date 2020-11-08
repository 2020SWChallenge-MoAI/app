<template>
  <sub-layout
    title="독서하기"
    :tooltip="book ? book.title : '책 선택 안 됨'"
  >
    <flip-book
      ref="viewer"
      v-slot="viewer"
      class="book-viewer"
      :pages="pages"
      :zooms="[1, 2]"
      :flip-duration="flipDuration"
      @flip-left-end="onFlip"
      @flip-right-end="onFlip"
    >
      <div class="book-viewer-control">
        <v-btn
          light
          icon
          @click="delayedFlipLeft"
        >
          <v-icon
            x-large
            color="#668d8d"
          >
            mdi-arrow-left-circle
          </v-icon>
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
        <v-btn
          light
          icon
          @click="delayedFlipRight"
        >
          <v-icon
            x-large
            color="#668d8d"
          >
            mdi-arrow-right-circle
          </v-icon>
        </v-btn>
      </div>
    </flip-book>
    <finish-overlay
      v-show="finished"
      :success="true"
      message="다 읽었어요"
    >
      <overlay-button
        text="독서 완료하기"
        @click.native="dialog = true"
      />
      <overlay-button
        text="더 읽기"
        @click.native="finished = false"
      />
    </finish-overlay>
    <v-dialog
      v-model="dialog"
      width="50vw"
    >
      <v-card class="finish-dialog">
        <h2>다양한 독후활동으로 나만의 생각을 펼쳐 보자!</h2>
        <div class="finish-dialog-content">
          <right-menu-button
            text="생각펼치기"
            url="/activity/mindmap"
            :image="require('@/assets/img/layouts/base/right/mindmap.svg')"
          />
          <right-menu-button
            text="그림설명"
            url="/activity/writing"
            :image="require('@/assets/img/layouts/base/right/writing.svg')"
          />
          <right-menu-button
            text="그림그리기"
            url="/activity/drawing"
            :image="require('@/assets/img/layouts/base/right/writing.svg')"
          />
          <right-menu-button
            text="독서퀴즈"
            url="/activity/quiz-game"
            :image="require('@/assets/img/layouts/base/right/quiz-game.svg')"
          />
        </div>
      </v-card>
    </v-dialog>
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
      flipDuration: 300,
      finished: false,
      pages: [],
      dialog: false,
    };
  },
  computed: {
    book() {
      return this.$store.getters.currentBook;
    },
  },
  watch: {
    async book() {
      await this.loadBook();
    },
  },
  async created() {
    this.delayedFlipLeft = _.debounce(this.flipLeft, this.flipDuration);
    this.delayedFlipRight = _.debounce(this.flipRight, this.flipDuration);

    // eslint-disable-next-line global-require
    this.audio = new Audio(require('../assets/wav/page-flip.wav'));
    this.audio.volume = 0.1;

    if (this.book) await this.loadBook();
    else this.$store.dispatch('showError', '책이 선택되지 않았어!');
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
    async loadBook() {
      this.$store.dispatch('loadStart');

      const pageRange = _.range(1, this.book.pageNum + 1);
      Promise
        .all(pageRange.map(async (page) => this.$store.dispatch('downloadBookPage', { page, bid: this.book.bid })))
        .then((pages) => {
          this.pages = [null].concat(pages).concat([null]);
          this.$store.dispatch('loadFinish');
        })
        .catch(() => this.$store.dispatch('showError', '책을 불러올 수 없어...'));
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

::v-deep .book-viewer .viewport .container {
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

::v-deep .page-input {
  width: 20vw;
}

::v-deep .page-input input {
  text-align: center;
}

.finish-dialog {
  padding: 2vw;
  text-align: center;
}

.finish-dialog-content {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-top: 2vw;
}
</style>
