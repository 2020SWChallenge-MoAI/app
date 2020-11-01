<template>
  <sub-layout
    title="독서퀴즈"
    :tooltip="book.title"
  >
    <div class="wrapper">
      <div class="content">
        <div class="question">
          <div class="question-text-wrapper">
            <div class="question-type-tooltip">
              주관식/객관식 바꾸기 →
            </div>
            <v-textarea
              v-model="question.text"
              class="question-text"
              auto-grow
              clearable
              flat
              solo
              hide-details
              rows="2"
              color="#668d8d"
              label="문제를 입력해 줘!"
              prefix="Q."
            >
              <v-btn
                slot="append"
                depressed
                filled
                rounded
                dark
                color="#668d8d"
                @click="verifyQuestion"
              >
                검사하기
              </v-btn>
            </v-textarea>
          </div>
          <div class="question-type">
            <span
              v-show="question.type === 0"
              @click="
                question.type = 1;
                question.answer = null;
              "
            >
              객관식
            </span>
            <span
              v-show="question.type === 1"
              @click="
                question.type = 0;
                question.answer = null;
              "
            >
              주관식
            </span>
          </div>
        </div>
        <div
          v-show="question.type == 0"
          class="answer answer-choice"
        >
          <p>A. 답을 입력해 줘!</p>
          <v-radio-group
            v-model="question.answer"
            hide-details
            row
            class="mt-0"
          >
            <div
              v-for="(option, index) in question.options"
              :key="index"
              class="answer-option"
            >
              <v-text-field
                v-model="option.text"
                clearable
                flat
                solo
                hide-details
                x-small
                color="#668d8d"
                class="answer-option-text"
              >
                <v-radio
                  slot="prepend"
                  hide-details
                  label="정답"
                  :value="index + 1"
                  color="#668d8d"
                  class="answer-option-radio"
                />
              </v-text-field>
            </div>
          </v-radio-group>
          <div class="answer-choice-btns">
            <v-btn
              color="#ee8f89"
              dark
              icon
              :disabled="question.options.length <= 2"
              class="answer-choice-btn"
              @click="removeOption"
            >
              <v-icon>mdi-minus-circle</v-icon>
            </v-btn>
            <v-btn
              icon
              color="#668d8d"
              dark
              :disabled="question.options.length >= 4"
              class="answer-choice-btn"
              @click="addOption"
            >
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
            <v-btn
              depressed
              rounded
              filled
              color="#668d8d"
              dark
              class="answer-choice-btn"
              @click="verifyAnswer"
            >
              검사하기
            </v-btn>
          </div>
        </div>
        <v-textarea
          v-show="question.type == 1"
          v-model="question.answer"
          class="answer answer-essay answer-text"
          auto-grow
          clearable
          flat
          solo
          hide-details
          rows="2"
          color="#668d8d"
          label="답을 입력해 줘!"
          prefix="A."
        >
          <v-btn
            slot="append"
            depressed
            filled
            rounded
            dark
            color="#668d8d"
            @click="verifyAnswer"
          >
            검사하기
          </v-btn>
        </v-textarea>
      </div>
      <div class="btns">
        <div
          v-ripple
          class="btn btn-reset"
          @click="reset"
        >
          <span>다시 쓰기</span>
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
  </sub-layout>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      question: {
        text: '',
        type: 0, // 0(choice) 1(essay)
        options: [{ text: '' }, { text: '' }],
        answer: '',
      },
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
  watch: {},
  methods: {
    encodeAnswer() {
      if (this.question.type === 0) {
        let answer = `${this.question.answer}`;

        this.question.options.forEach((o) => {
          answer += `#@@#${o.text}`;
        });

        return answer;
      }

      return this.question.answer;
    },
    verifyQuestion() {
      axios
        .post(`/api/book/${this.book.bid}/qna/verify/question`, {
          question: this.question.text,
        })
        .then(() => {
          this.$store.dispatch('showMessage', {
            mode: 'success',
            message: '좋은 질문이야!',
          });
        })
        .catch(() => {
          this.$store.dispatch('showMessage', {
            mode: 'error',
            message: '질문에 문제가 있는 것 같아. 다시 만들어 보자!',
          });
        });
    },
    verifyAnswer() {
      axios
        .post(`/api/book/${this.book.bid}/qna/verify/answer`, {
          question: this.question.text,
          type: this.question.type,
          answer: this.encodeAnswer(),
        })
        .then(() => {
          this.$store.dispatch('showMessage', {
            mode: 'success',
            message: '좋은 답이야!',
          });
        })
        .catch(() => {
          this.$store.dispatch('showMessage', {
            mode: 'error',
            message: '질문과 답이 맞지 않는 것 같아. 다시 만들어 보자!',
          });
        });
    },
    addOption() {
      if (this.question.options.length >= 4) return;
      this.question.options.push({ text: '' });
    },
    removeOption() {
      if (this.question.options.length <= 2) return;
      this.question.options.pop();
    },
    reset() {
      this.question.text = '';
      this.question.options = [{ text: '' }, { text: '' }];
      this.question.answer = '';
    },
    submit() {
      axios
        .post(`/api/book/${this.book.bid}/qna/submit`, {
          question: this.question.text,
          type: this.question.type,
          answer: this.encodeAnswer(),
        })
        .then()
        .catch();
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

.question-text-wrapper {
  flex: 1;
}

.question-type-tooltip {
  text-align: right;
  margin-bottom: 1vh;
}

.question-text {
  flex: 1;
  position: relative;
  background: #f0ebd7;
  border-radius: 1vw;
  overflow-wrap: anywhere;
  font-size: 1.2em;
  padding: 2vw;
}

.question-text:after {
  content: '';
  position: absolute;
  right: 0;
  top: 4vh;
  width: 0;
  height: 0;
  border: 1em solid transparent;
  border-left-color: #f0ebd7;
  border-right: 0;
  border-top: 0;
  margin-top: -0.5em;
  margin-right: -1em;
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

.answer {
  background-color: #f0ebd7;
  border-radius: 1vw;
  padding: 2vw;
}

.answer-option {
  width: calc(50% - 1vw);
  margin-bottom: 1vw;
}

.answer-option:not(:nth-child(2n)) {
  margin-right: 2vw;
}

/deep/ .answer-option .v-radio {
  align-items: flex-start !important;
}

/deep/ .answer-text .v-input__slot,
/deep/ .question-text .v-input__slot {
  background: none !important;
}

.answer-text {
  font-size: 1.2em;
}

.answer-choice-btns {
  display: flex;
  justify-content: flex-end;
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

.btn-reset {
  background: url('~@/assets/img/views/activity/quiz-game/reset-button-background.png')
    #f0ebd7;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
}
</style>
