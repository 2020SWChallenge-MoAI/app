<template>
  <div class="book-title">
    <span>책 제목: {{ book.title }}</span>
  </div>
</template>

<script>
export default {
  props: ['book'],
};
</script>

<style scoped>
.book-title {
  text-align: center;
  background: #f0ebd7;
  border-radius: 1vw;
  padding: 1vw;
}
</style>
