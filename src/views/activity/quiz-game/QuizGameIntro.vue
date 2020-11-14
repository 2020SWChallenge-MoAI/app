<template>
  <sub-layout
    title="독서퀴즈"
    tooltip="책에 관련된 퀴즈를 내거나 풀어서 이해력을 길러 보자!"
  >
    <div
      v-if="loaded"
      class="wrapper"
    >
      <div class="book-title">
        <span>책 제목: {{ book.title }}</span>
      </div>
      <div class="btn-wrapper">
        <router-link
          v-ripple
          class="btn-quiz btn-creation"
          to="/activity/quiz-game/creation"
        >
          <span>문제 내기</span>
        </router-link>
        <router-link
          v-ripple
          class="btn-quiz btn-solving"
          to="/activity/quiz-game/solving"
        >
          <span>문제 풀기</span>
        </router-link>
        <character-text-bubble tooltip="버튼을 선택해 줘!" />
      </div>
    </div>
  </sub-layout>
</template>

<script>
import CharacterTextBubble from '../../../components/CharacterTextBubble.vue';

export default {
  components: {
    CharacterTextBubble,
  },
  data() {
    return {
      loaded: false,
    };
  },
  computed: {
    book() {
      return this.$store.getters.currentBook;
    },
  },
  watch: {
    book() {
      this.loadBook();
    },
  },
  created() {
    this.loadBook();
  },
  methods: {
    loadBook() {
      this.$store.dispatch('loadStart');
      if (!this.book) {
        this.$store.dispatch('showError', '책이 선택되지 않았어!');
        return;
      }

      this.loaded = true;
      this.$store.dispatch('loadFinish');
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex: 1;
  flex-flow: column;
  padding: 2vw;
}

.tooltip {
  text-align: center;
  margin-bottom: 3vh;
}

.book-title {
  text-align: center;
  background: #f0ebd7;
  border-radius: 1vw;
  padding: 1vw;
}

.btn-wrapper {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;

  .btn-quiz {
    width: 100%;
    height: 25vh;
    border-radius: 1vw;
    text-decoration: none;
    color: #202937;
    display: flex;
    align-items: center;

    span {
      display: block;
      font-size: 2em;
      color: white;
      margin-left: 3vw;
    }
  }

  .btn-quiz:not(:last-of-type) {
    margin-right: 2vw;
  }
}

.btn-creation {
  background: url('~@/assets/img/views/activity/quiz-game/creation-button-background.png')
  #202937;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
}

.btn-solving {
  background: url('~@/assets/img/views/activity/quiz-game/solving-button-background.png')
  #202937;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
}
</style>
