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
import axios from 'axios';
import CharacterTextBubble from '../../../components/CharacterTextBubble.vue';

export default {
  components: {
    CharacterTextBubble,
  },
  data() {
    return {
      images: [],
    };
  },
  computed: {
    book() {
      return this.$store.getters.getCurrentBook;
    },
  },
  created() {
    this.$store.commit('loadStart');
    axios
      .get(`/api/book/${this.book.bid}/main-image`)
      .then(({ data }) => {
        this.images = data.main_images.map((b) => `data:image/png;base64,${b}`);
        this.$store.commit('loadFinish');
      })
      .catch();
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
