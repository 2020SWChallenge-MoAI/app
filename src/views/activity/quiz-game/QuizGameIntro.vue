<template>
  <sub-layout
    title="독서퀴즈"
    :tooltip="book ? book.title : '책 선택 안 됨'"
  >
    <div class="wrapper">
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
        <character-text-bubble tooltip="책에 관련된 퀴즈를 풀거나 내서 이해도를 높여 보자!" />
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
  computed: {
    book() {
      return (
        this.$store.getters.currentBook || { title: '책을 선택해 보자!' }
      );
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex: 1;
  flex-flow: column;
  justify-content: center;
  padding: 2vw;
}

.tooltip {
  text-align: center;
  margin-bottom: 3vh;
}

.btn-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.btn-quiz {
  width: 30vw;
  height: 25vh;
  border-radius: 1vw;
  text-decoration: none;
  color: #202937;
  display: flex;
  align-items: center;
}

.btn-quiz span {
  display: block;
  font-size: 2em;
  color: white;
  margin-left: 3vw;
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
