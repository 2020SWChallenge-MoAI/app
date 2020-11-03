<template>
  <sub-layout
    title="그림설명하기"
    :tooltip="book.title"
  >
    <template v-slot:left>
      <left-menu-button
        icon="mdi-content-save"
        text="저장"
      />
    </template>
    <v-img src="" />
    <v-textarea />
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
