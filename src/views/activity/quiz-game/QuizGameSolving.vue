<template>
  <sub-layout
    title="독서퀴즈"
    :tooltip="book ? book.title : '책 선택 안 됨'"
  >
    <div class="wrapper">
      <div class="content">
        <div class="question">
          <div class="question-text">
            <span>{{ question.text }}</span>
          </div>
          <div class="question-type">
            <span v-show="question.type === 0">객관식</span>
            <span v-show="question.type === 1">주관식</span>
          </div>
        </div>
        <div class="answer">
          <img
            class="answer-character"
            src="@/assets/img/views/activity/quiz-game/solving-button-background.png"
          >
          <v-textarea
            v-show="question.type === 1"
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
            v-show="question.type === 0"
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
          class="btn btn-reload"
          @click="reload"
        >
          <span>다른문제</span>
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

    <finish-overlay
      v-show="submitted && correct"
      :success="true"
      message="정답이야!"
    >
      <overlay-button
        text="다른 문제 풀기"
        @click.native="reload"
      />
      <overlay-button
        text="활동 마치기"
        @click.native="$router.replace('/')"
      />
    </finish-overlay>
    <finish-overlay
      v-show="submitted && !correct"
      :success="false"
      message="다시 한 번 풀어보자!"
    >
      <overlay-button
        text="다시 풀어보기"
        @click.native="reset"
      />
      <overlay-button
        text="활동 마치기"
        @click.native="$router.replace('/')"
      />
    </finish-overlay>
  </sub-layout>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      question: {},
      answer: '',
      submitted: false,
      correct: false,
      valid: false,
    };
  },
  computed: {
    book() {
      return (
        this.$store.getters.currentBook
      );
    },
  },
  watch: {
    book() {
      this.loadQuestion();
    },
  },
  async created() {
    if (this.book) await this.loadQuestion();
    else this.$store.dispatch('showError', '책이 선택되지 않았어!');
  },
  methods: {
    loadQuestion() {
      this.$store.dispatch('loadStart');

      const parseOptions = (text) => {
        const options = text.split('#@@#');
        return { options: options.slice(1), answer: options[parseInt(options[0], 10)] };
      };

      axios.get(`/api/book/${this.book.bid}/qna/rand`)
        .then(({ data }) => {
          if (data.type === 0) {
            const answerData = parseOptions(data.answer);

            this.question = {
              qid: data.qid,
              text: data.question,
              type: data.type,
              options: answerData.options,
              answer: answerData.answer,
            };
          } else {
            this.question = {
              qid: data.qid,
              text: data.question,
              type: data.type,
              options: [],
              answer: data.answer,
            };
          }

          this.$store.dispatch('loadFinish');
        })
        .catch(() => {
          this.$store.dispatch('showError', '충분한 문제가 없어...');
        });
    },
    async submit() {
      if (!this.answer) {
        this.$store.dispatch('showMessage', { mode: 'error', message: '답을 입력해 줘!' });
        return;
      }

      this.correct = this.question.answer === this.answer;
      this.submitted = true;

      if (this.correct) {
        axios.post('/api/user/work/save', {
          bid: this.book.bid,
          type: 1,
          content: JSON.stringify({
            work: 1, // 만들기: 0, 풀기: 1
            question: this.question.text,
            type: this.question.type,
            answer: this.question.answer,
          }),
        });
      }
    },
    reset() {
      this.submitted = false;
      this.correct = false;
      this.answer = '';
    },
    reload() {
      this.reset();
      this.loadQuestion();
    },
  },
};
</script>

<style lang="scss" scoped>
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

  span {
    display: block;
    margin-top: 60%;
  }
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

  &:after {
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

  :after {
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

  ::v-deep .v-input__slot {
    background: #f0ebd7 !important;
  }

  &.answer-choice .tooltip {
    font-size: 0.8em;
    margin-bottom: 1vh;
  }
}

.answer-options {
  display: flex;
  flex-wrap: wrap;

  :nth-child(2n+1) {
    margin-right: 2vw;
  }

  :not(:nth-last-child(2)):not(:last-child) {
    margin-bottom: 2vh;
  }
}

.answer-option {
  width: calc(50% - 1vw);
  height: 100%;
  background: #fff;
  border-radius: 1vw;
  padding: 1vh;
  text-align: center;

  &.active {
    color: white;
    background: #668d8d;
  }
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

.btn-reload {
  background: url('~@/assets/img/views/activity/quiz-game/refresh.png') #f0ebd7;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
}
</style>
