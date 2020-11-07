<template>
  <sub-layout
    title="독서퀴즈"
    :tooltip="book ? book.title : '책 선택 안 됨'"
  >
    <template v-slot:left>
      <left-menu-button
        icon="mdi-check-bold"
        text="완료"
        @click.native="submit"
      />
      <left-menu-button
        icon="mdi-trash-can"
        text="다시쓰기"
        @click.native="reset"
      />
    </template>
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
              flat
              solo
              hide-details
              rows="2"
              color="#668d8d"
              label="문제를 입력해 줘!"
              prefix="Q."
              :class="{
                error: questionValidated && !questionValid,
                success: questionValidated && questionValid
              }"
              @input="questionValidated = false"
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
            <v-btn-toggle
              v-model="question.type"
              color="#668d8d"
              dense
              borderless
              mandatory
              @change="changeQuestionType"
            >
              <v-btn :value="0">
                객관식
              </v-btn>
              <v-btn :value="1">
                주관식
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
        <div class="answer">
          <div
            v-show="question.type == 0"
            class="answer-text answer-choice"
            :class="{
              error: answerValidated && !answerValid,
              success: answerValidated && answerValid
            }"
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
                  flat
                  solo
                  hide-details
                  x-small
                  color="#668d8d"
                  class="answer-option-text"
                  @input="answerValidated = false"
                >
                  <v-radio
                    slot="prepend"
                    hide-details
                    :label="`보기 ${index + 1}`"
                    :value="index + 1"
                    color="#668d8d"
                    class="answer-option-radio"
                    @change="answerValidated = false"
                  />
                </v-text-field>
              </div>
            </v-radio-group>
            <div class="answer-choice-btns">
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
            class="answer-text answer-essay"
            auto-grow
            flat
            solo
            hide-details
            rows="2"
            color="#668d8d"
            label="답을 입력해 줘!"
            prefix="A."
            :class="{
              error: answerValidated && !answerValid,
              success: answerValidated && answerValid
            }"
            @input="answerValidated = false"
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
      </div>
    </div>
    <finish-overlay
      v-show="submitted"
      :success="true"
      message="좋았어!"
    >
      <overlay-button
        text="다른 문제 만들기"
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
      question: {
        text: '',
        type: 0, // 0(choice) 1(essay)
        options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
        answer: '',
      },
      questionValidated: false,
      questionValid: true,
      answerValidated: false,
      answerValid: true,
      submitted: false,
    };
  },
  computed: {
    book() {
      return (
        this.$store.getters.currentBook || { title: '책을 선택해 보자!' }
      );
    },
  },
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
          this.questionValidated = true;
          this.questionValid = true;
          this.$store.dispatch('showMessage', {
            mode: 'success',
            message: '좋은 질문이야!',
          });
        })
        .catch(() => {
          this.questionValidated = true;
          this.questionValid = false;
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
          this.answerValidated = true;
          this.answerValid = true;
          this.$store.dispatch('showMessage', {
            mode: 'success',
            message: '좋은 답이야!',
          });
        })
        .catch(() => {
          this.answerValidated = true;
          this.answerValid = false;
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
      this.question.options = [{ text: '' }, { text: '' }, { text: '' }, { text: '' }];
      this.question.answer = '';
      this.questionValid = true;
      this.questionValidated = false;
      this.answerValid = true;
      this.answerValidated = false;
      this.submitted = false;
    },
    submit() {
      if (!this.questionValidated || !this.questionValidated) {
        this.$store.dispatch('showMessage', {
          mode: 'error',
          message: '질문과 답이 아직 검사되지 않았어. 검사하기 버튼을 눌러서 문제를 검사하자!',
        });
        return;
      }
      if (!this.questionValid || !this.answerValid) {
        this.$store.dispatch('showMessage', {
          mode: 'error',
          message: '질문과 답에 문제가 있는 것 같아. 내용을 수정하고 검사하기 버튼을 눌러 줘!',
        });
        return;
      }

      axios
        .post(`/api/book/${this.book.bid}/qna/submit`, {
          question: this.question.text,
          type: this.question.type,
          answer: this.encodeAnswer(),
        })
        .then(() => { this.submitted = true; })
        .catch(() => {
          this.$store.dispatch('showMessage', {
            mode: 'error',
            message: '문제가 있는 것 같아. 다시 한 번 시도해 보자!',
          });
        });
    },
    changeQuestionType(type) {
      this.question.type = type;
      this.question.options = [{ text: '' }, { text: '' }, { text: '' }, { text: '' }];
      this.question.answer = '';
      this.questionValid = true;
      this.questionValidated = false;
      this.answerValid = true;
      this.answerValidated = false;
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

.question-text.error, .answer-text.error {
  background-color: #f0ebd7 !important;
  border: 2px solid #e98d89 !important;
}

.question-text.success, .answer-text.success {
  background-color: #f0ebd7 !important;
  border: 2px solid #8bc673 !important;
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
  background: url('~@/assets/img/views/activity/quiz-game/creation-button-background.png');
  background-size: contain;
  background-repeat: no-repeat;
  text-align: right;
}

.question-type span {
  display: block;
  margin-top: 60%;
}

.answer-text {
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

::v-deep .answer-option .v-radio {
  align-items: flex-start !important;
}

::v-deep .answer-text.answer-essay .v-input__slot,
::v-deep .question-text .v-input__slot {
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
