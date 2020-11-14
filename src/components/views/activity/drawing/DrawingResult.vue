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
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}
.drawing-result-picture {
  width: 94%;
  margin-left: 3%;
  margin-top: 0.5%;
  border: 2px solid rgba(155, 155, 155);
}
.drawing-result-text {
  width: 95%;
  flex: 1;
  margin-left: 2.5%;
  margin-top: 0;
  font-size: 1.5vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
}
.drawing-result-text::-webkit-scrollbar {
  display: none;
}
</style>
