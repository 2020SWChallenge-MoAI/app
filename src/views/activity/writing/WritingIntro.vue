<template>
  <sub-layout
    title="그림설명하기"
    :tooltip="book ? book.title : '책 선택 안 됨'"
  >
    <div class="wrapper">
      <div class="main-images">
        <main-image
          v-for="image in images"
          :key="image.rank"
          :src="image.uri"
          width="40%"
          class="main-image"
          @click.native="$router.push(`/activity/writing/process?rank=${image.rank}`)"
        />
      </div>
      <div
        class="main-images-prev"
        :class="{ disabled: isStart }"
        @click="prevPage"
      >
        <img src="@/assets/img/layouts/base/left/more.svg">
      </div>
      <div
        class="main-images-next"
        :class="{ disabled: isEnd }"
        @click="nextPage"
      >
        <img src="@/assets/img/layouts/base/left/more.svg">
      </div>
      <character-text-bubble
        tooltip="원하는 그림을 골라서 설명해 보자!"
        @click.native="nextPage"
      />
    </div>
  </sub-layout>
</template>

<script>
import _ from 'lodash';
import CharacterTextBubble from '../../../components/CharacterTextBubble.vue';
import MainImage from '../../../components/views/activity/writing/MainImage.vue';

const imagesPerPage = 4;

export default {
  components: {
    CharacterTextBubble,
    MainImage,
  },
  data() {
    return {
      images: [],
      page: 0,
      delay: 300,
    };
  },
  computed: {
    book() {
      return this.$store.getters.currentBook;
    },
    isStart() {
      return this.page === 0;
    },
    isEnd() {
      if (!this.totalPages) return true;
      return this.page === (this.totalPages - 1);
    },
    totalPages() {
      if (!this.book) return 0;
      return Math.ceil(this.book.imageNum / imagesPerPage);
    },
  },
  watch: {
    book() {
      this.load();
    },
    page() {
      this.loadImages();
    },
  },
  created() {
    this.delayedLoadImages = _.debounce(this.loadImages, this.delay);
    this.load();
  },
  methods: {
    async load() {
      this.page = 0;

      this.$store.dispatch('loadStart');
      if (!this.book) this.$store.dispatch('showError', '책이 선택되지 않았어!');
      else if (!this.totalPages) this.$store.dispatch('showError', '충분한 삽화가 없어...');
      else {
        await this.loadImages();
        this.$store.dispatch('loadFinish');
      }
    },
    async loadImages() {
      const range = _.range(
        imagesPerPage * this.page + 1,
        Math.min(this.book.imageNum + 1, imagesPerPage * (this.page + 1) + 1),
      );

      this.images = await Promise.all(
        range.map(async (rank) => ({
          rank, uri: await this.$store.dispatch('downloadBookMainImage', { rank, bid: this.book.bid, thumbnail: true }),
        })),
      );
    },
    nextPage() {
      if (this.isEnd) return;
      this.page += 1;
      this.delayedLoadImages();
    },
    prevPage() {
      if (this.isStart) return;
      this.page -= 1;
      this.delayedLoadImages();
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  padding: 2vw;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.content {
  display: flex;
}

.main-images-prev {
  position: absolute;
  top: 30vh;
  left: 0;

  &.disabled {
    opacity: 0.5;
  }

  img {
    transform: rotate(90deg);
  }
}

.main-images-next {
  position: absolute;
  top: 30vh;
  right: 0;

  &.disabled {
    opacity: 0.5;
  }

  img {
    transform: rotate(-90deg);
  }
}

.main-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.main-image {
  max-width: 40%;

  &:not(:nth-child(2n)) {
    margin-right: 2vw;
  }
  &:not(:last-child):not(:nth-last-child(2)) {
    margin-bottom: 2vw;
  }
}

.finish-overlay div {
  display: flex;
  flex-flow: column;
  text-align: center;
  align-items: center;
}

.finish-overlay div > *:not(:last-child) {
  margin-bottom: 2vh;
}

.finish-overlay img {
  width: 20vw;
}
</style>
