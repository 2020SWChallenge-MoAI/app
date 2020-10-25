<template>
  <ul class="recent-books">
    <li v-for="(book, index) in recentBooks" :key="index" class="recent-book">
      <book-menu-button :image="require(`@/assets/img/${book.thumbnail}`)" />
    </li>
    <li class="recent-book-more">
      <img :src="require('@/assets/img/layouts/base/left/more.svg')" />
    </li>
  </ul>
</template>

<script>
export default {
  computed: {
    recentBooks() {
      return this.$store.getters.getRecentBooks;
    },
  },
};
</script>

<style scoped>
.recent-books {
  position: absolute;
  bottom: 0;
  list-style: none;
  padding: 0;
  width: 100%;
}

.recent-books li {
  width: 100%;
}

.recent-book {
  width: 6vw;
  height: 6vw;
  margin-top: 1vh;
  border-radius: 1vw;
  overflow: hidden;
}

.recent-book-more img {
  width: 100%;
}
</style>
