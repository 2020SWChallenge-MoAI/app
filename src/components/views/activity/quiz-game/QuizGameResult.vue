<template>
  <div class="wrapper">
    <div class="quiz-type">
      {{ quizType }}
    </div>
    <div class="bubble question">
      Q. {{ content.question }}
    </div>
    <div class="bubble answer">
      A. {{ content.answer }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['work'],
  computed: {
    content() {
      return JSON.parse(this.work.content);
    },
    quizType() {
      return this.content.work === 0 ? '문제 만들기' : '문제 풀기';
    },
  },
  methods: {
    parseOptions(text) {
      const options = text.split('#@@#');
      return { options: options.slice(1), answer: options[parseInt(options[0], 10)] };
    },
    parseAnswer() {
      if (this.content.question.type === 0) return this.parseOptions(this.content.answer).answer;
      return this.content.answer;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  padding: 2vw;
}

.quiz-type {
  background: #668d8d;
  border-radius: 1vw;
  padding: 1vw;
  color: white;
  text-align: center;
}

.bubble {
  position: relative;
  background: #f0ebd7;
  border-radius: 1vw;
  overflow-wrap: anywhere;
  font-size: 1.2em;
  padding: 2vw;
}

.question:after {
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

.answer:after {
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
</style>
