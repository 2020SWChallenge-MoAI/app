<template>
  <sub-layout
    title="독서퀴즈"
    :tooltip="book.title"
  >
    <div class="wrapper">
      <div class="content">
        <div class="question">
          <div class="question-text">
            <span>{{ question.text }}</span>
          </div>
          <div class="question-type">
            <span v-show="question.type === 'essay'">주관식</span>
            <span v-show="question.type === 'choice'">객관식</span>
          </div>
        </div>
        <div class="answer">
          <img
            class="answer-character"
            src="@/assets/img/views/activity/quiz-game/student-background.png"
          >
          <v-textarea
            v-show="question.type === 'essay'"
            v-model="answer"
            class="answer-text answer-essay"
            auto-grow
            clearable
            flat
            solo
            hide-details
            rows="2"
            color="#668d8d"
            label="정답을 입력해 줘!"
          />
          <div
            v-show="question.type === 'choice'"
            class="answer-text answer-choice"
          >
            <span class="tooltip">정답을 선택해 줘!</span>
            <div class="answer-options">
              <div
                v-for="(option, index) in question.options"
                :key="index"
                class="answer-option"
                :class="{ active: answer === option }"
                @click="answer = option"
              >
                <span>{{ option }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <div
          v-ripple
          class="btn btn-hint"
        >
          <span>힌트 보기</span>
        </div>
        <div
          v-ripple
          class="btn btn-submit"
          @click="submit"
        >
          <span>제출하기</span>
        </div>
      </div>
    </div>
    <v-overlay
      color="#fff"
      absolute
      opacity="0.8"
      z-index="99"
      :dark="false"
      :light="true"
      :value="submitted"
      class="finish-overlay"
    >
      <div v-show="!correct">
        <img src="@/assets/img/views/activity/quiz-game/answer-wrong.png">
        <h1>다시 한 번만 생각해 보자!</h1>
        <v-btn
          dark
          rounded
          depressed
          x-large
          color="#668d8d"
          @click="submitted = false"
        >
          다시 풀어보기
        </v-btn>
        <v-btn
          dark
          rounded
          depressed
          x-large
          color="#668d8d"
          @click="$router.replace('/')"
        >
          활동 마치기
        </v-btn>
      </div>
      <div v-show="correct">
        <img src="@/assets/img/views/activity/quiz-game/answer-correct.png">
        <h1>정답이야!</h1>
        <v-btn
          dark
          rounded
          depressed
          x-large
          color="#668d8d"
          @click="reload"
        >
          다른 문제 풀기
        </v-btn>
        <v-btn
          dark
          rounded
          depressed
          x-large
          color="#668d8d"
          @click="$router.replace('/')"
        >
          활동 마치기
        </v-btn>
      </div>
    </v-overlay>
  </sub-layout>
</template>

<script>
// import axios from 'axios';

export default {
  data() {
    return {
      step: 'intro',
      question: null,
      answer: '',
      submitted: false,
      correct: false,
      valid: false,
    };
  },
  computed: {
    book() {
      return (
        this.$store.getters.getCurrentBook || { title: '책을 선택해 보자!' }
      );
    },
  },
  async created() {
    this.loadQuestion();
  },
  methods: {
    async submit() {
      if (!this.answer) {
        this.$store.dispatch('showMessage', { mode: 'error', message: '답을 입력해 줘!' });
        return;
      }

      // const { data } = await axios.post(
      //  `/api/book/${this.book.bid}/qna/verify/answer/${this.qid}`, {
      //   answer: this.answer,
      // });

      const data = { correct: true };

      this.correct = data.correct;
      this.submitted = true;
    },
    loadQuestion() {
      this.$store.commit('loadStart');

      // const { data } = await axios.get(`/api/book/${this.book.bid}/qna/rand`);
      this.question = {
        qid: 0,
        text: '흥부가 다리를 치료해준 사람은?',
        type: 'essay',
        options: ['제비', '놀부', '박씨', '임금님'],
        answer: '제비',
      };
      this.$forceUpdate();

      this.$store.commit('loadFinish');
    },
    reload() {
      this.submitted = false;
      this.correct = false;
      this.answer = '';

      this.loadQuestion();
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  flex: 1;
  padding: 2vw;
}

.content > div:not(:last-child) {
  margin-bottom: 1vw;
}

.question {
  display: flex;
  align-items: flex-start;
}

.question-type {
  width: 12vw;
  height: 15vw;
  background: url('~@/assets/img/views/activity/quiz-game/question-type-background.png');
  background-size: contain;
  background-repeat: no-repeat;
  text-align: center;
}

.question-type span {
  display: block;
  margin-top: 60%;
}

.question-text {
  flex: 1;
  position: relative;
  background: #f0ebd7;
  border-radius: 1vw;
  padding: 2vw;
  overflow-wrap: anywhere;
  text-align: center;
  font-size: 1.2em;
}

.question-text:after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 1em solid transparent;
  border-left-color: #f0ebd7;
  border-right: 0;
  border-top: 0;
  margin-top: -0.5em;
  margin-right: -1em;
}

.answer {
  display: flex;
  align-items: flex-start;
}

.answer-character {
  height: 15vw;
}

.answer-text {
  flex: 1;
  position: relative;
  background: #f0ebd7;
  border-radius: 1vw;
  font-size: 1.2em;
  padding: 2vw;
  display: flex;
  flex-flow: column;
}

/deep/ .answer-text .v-input__slot {
  background: #f0ebd7 !important;
}

.answer-text:after {
  content: '';
  position: absolute;
  left: 0;
  top: 4vh;
  width: 0;
  height: 0;
  border: 1em solid transparent;
  border-right-color: #f0ebd7;
  border-left: 0;
  border-top: 0;
  margin-top: -0.5em;
  margin-left: -1em;
}

.answer-text.answer-choice .tooltip {
  font-size: 0.8em;
  margin-bottom: 1vh;
}

.answer-options {
  display: flex;
  flex-wrap: wrap;
}

.answer-options > :nth-child(2n+1) {
  margin-right: 2vw;
}

.answer-options > :not(:nth-last-child(2)):not(:last-child) {
  margin-bottom: 2vh;
}

.answer-option {
  width: calc(50% - 1vw);
  height: 100%;
  background: #fff;
  border-radius: 1vw;
  padding: 1vh;
  text-align: center;
}

.answer-option.active {
  color: white;
  background: #668d8d;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.btns > :not(:last-child) {
  margin-right: 1vw;
}

.btn {
  width: 20vw;
  height: 7vw;
  border-radius: 1vw;
  display: flex;
  align-items: center;
  align-self: flex-end;
}

.btn span {
  display: block;
  font-size: 3vw;
  margin-left: 2vw;
}

.btn-submit {
  background: url('~@/assets/img/views/activity/quiz-game/submit-button-background.png')
    #668d8d;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
  color: white;
}

.btn-hint {
  background: url('~@/assets/img/views/activity/quiz-game/hint-button-background.png')
    #f0ebd7;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
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
