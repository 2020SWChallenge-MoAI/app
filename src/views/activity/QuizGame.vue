<template>
  <sub-layout title="독서퀴즈" :tooltip="book.title">
    <div>
      <h1>책에 관련된 퀴즈를 풀거나 내서 이해도를 높여 보자!</h1>
      <v-btn>
        <v-icon>mdi-comment-question</v-icon>
        <span>문제 내기</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-comment-question</v-icon>
        <span>문제 풀기</span>
      </v-btn>
    </div>
  </sub-layout>
</template>

<script>
export default {
  computed: {
    book() {
      return this.$store.getters.getCurrentBook;
    },
  },
};
</script>

<style></style>
