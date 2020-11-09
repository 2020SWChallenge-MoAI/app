<template>
  <div class="wrapper">
    <img
      class="drawing-result-picture"
      :src="content.thumbnail"
    >
    <div class="drawing-result-text">
      {{ content.sentence }}
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
};
</script>

<style lang="scss" scoped>
.drawing-result-picture {
  width: 98%;
  margin-left: 1%;
  margin-top: 0.5%;
  border: 2px solid rgba(155, 155, 155);
}
.drawing-result-text {
  width: 95%;
  height: 6vh;
  margin-left: 2.5%;
  margin-top: 0;
  overflow-y: scroll;
}
</style>
