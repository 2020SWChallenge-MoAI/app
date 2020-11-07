<template>
  <sub-layout
    title="그림설명하기"
    :tooltip="book.title"
  >
    <div class="wrapper">
      <div class="main-images">
        <v-sheet
          v-for="(uri, index) in images"
          :key="index"
          :elevation="5"
          class="main-image"
          @click="$router.push('/activity/writing/process')"
        >
          <v-img
            contain
            :src="uri"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey darken-5"
                />
              </v-row>
            </template>
          </v-img>
        </v-sheet>
      </div>
      <character-text-bubble tooltip="원하는 그림을 골라서 설명해 보자!" />
    </div>
  </sub-layout>
</template>

<script>
import _ from 'lodash';
import CharacterTextBubble from '../../../components/CharacterTextBubble.vue';
import util from '../../../util';

const imagesPerPage = 4;

export default {
  components: {
    CharacterTextBubble,
  },
  data() {
    return {
      images: [],
      page: 0,
    };
  },
  computed: {
    book() {
      return this.$store.getters.getCurrentBook;
    },
  },
  watch: {
    book() {
      this.page = 0;
      this.loadImages();
    },
    page() {
      this.loadImages();
    },
  },
  created() {
    this.loadImages();
  },
  methods: {
    async loadImages() {
      this.$store.commit('loadStart');

      const range = _.range(
        imagesPerPage * this.page + 1,
        Math.min(this.book.imageNum + 1, imagesPerPage * (this.page + 1) + 1),
      );

      this.images = await Promise.all(
        range
          .map((k) => `/api/book/${this.book.bid}/main-image?rank=${k}`)
          .map(async (uri) => util.base64(uri)),
      );

      this.$store.commit('loadFinish');
    },
  },
};
</script>

<style scoped>
.wrapper {
  flex: 1;
  padding: 2vw;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.main-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.main-image {
  max-width: 40%;
  border: 1vw solid white;
  border-radius: 1vw;
  overflow: hidden;
}

.main-image:not(:nth-child(2n)) {
  margin-right: 2vw;
}

.main-image:not(:last-child):not(:nth-last-child(2)) {
  margin-bottom: 2vw;
}
</style>
