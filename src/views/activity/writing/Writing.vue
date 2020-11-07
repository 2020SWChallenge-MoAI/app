<template>
  <sub-layout
    title="그림설명하기"
    :tooltip="book ? book.title : '책 선택 안 됨'"
  >
    <template v-slot:left>
      <left-menu-button
        icon="mdi-check-bold"
        text="완료"
        @click.native="submit"
      />
      <left-menu-button
        icon="mdi-refresh"
        text="다시쓰기"
        @click.native="reset"
      />
    </template>
    <v-form
      ref="content"
      class="scroll"
      lazy-validation
    >
      <main-image
        :src="imageSrc"
        width="80%"
        class="main-image"
      />
      <v-textarea
        v-model="description"
        auto-grow
        flat
        solo
        class="description"
        placeholder="여기를 눌러서 이 그림에 맞는 설명을 써 줘!"
        :rules="[v => (!!v && v.length > 50) || '설명이 너무 짧은 것 같아!']"
      />
    </v-form>
    <finish-overlay
      v-show="submitted"
      :success="true"
      message="좋았어!"
    >
      <overlay-button
        text="활동 마치기"
        @click.native="$router.replace('/')"
      />
    </finish-overlay>
  </sub-layout>
</template>

<script>
import axios from 'axios';
import MainImage from '../../../components/views/activity/writing/MainImage.vue';

export default {
  components: {
    MainImage,
  },
  props: ['rank'],
  data() {
    return {
      imageSrc: '',
      description: '',
      submitted: false,
      work: null,
    };
  },
  computed: {
    book() {
      return this.$store.getters.currentBook;
    },
  },
  async created() {
    if (!this.book) {
      this.$store.dispatch('showError', '책이 선택되지 않았어!');
      return;
    }

    this.$store.dispatch('loadStart');
    this.imageSrc = await this.$store.dispatch('downloadBookMainImage', { bid: this.book.bid, rank: this.rank });
    this.$store.dispatch('loadFinish');
  },
  methods: {
    async submit() {
      if (!this.$refs.content.validate()) {
        this.$store.dispatch('showMessage', { mode: 'error', message: '설명이 너무 짧은 것 같아! 좀 더 써볼까?' });
        return;
      }

      const work = {
        type: 3,
        bid: this.book.bid,
        content: JSON.stringify({
          rank: this.rank,
          description: this.description,
        }),
      };

      this.work = work;

      axios.post('/api/user/work/save', work)
        .then(() => { this.submitted = true; });
    },
    reset() {
      this.submitted = false;
      this.description = '';
      this.$refs.content.resetValidation();
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll {
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow-y: scroll;
  align-items: center;
}

.main-image {
  margin: 1vw;
}

.description {
  padding-right: 1vw;
  width: 80%;

  ::v-deep .v-input__slot {
    background: none !important;
  }
  ::v-deep textarea {
    line-height: 4vh;
    background: repeating-linear-gradient(
      rgb(255, 253, 242) 0px,
      rgb(255, 253, 242) calc(4vh - 3px),
      rgb(131, 177, 177) 4vh);
  }
  &:invalid {
    border: 3px solid red;
  }
}
</style>
