<template>
  <div class="recent-books-menu">
    <p class="recent-books-menu-title">최근독서</p>
    <ul class="recent-books">
      <li class="recent-book-more up" v-if="isPaginationNeeded && !isStart" @click="prevPage">
        <img :src="require('@/assets/img/layouts/base/left/more.svg')" />
      </li>
      <li
        class="recent-book"
        v-for="(book, index) in currentBooks"
        :key="index"
      >
        <book-menu-button
          :image="require(`@/assets/img/${book.thumbnail}`)"
        />
      </li>
      <li class="recent-book-more down" v-if="isPaginationNeeded && !isEnd" @click="nextPage">
        <img :src="require('@/assets/img/layouts/base/left/more.svg')" />
      </li>
    </ul>
  </div>
</template>

<script>
const booksPerPage = 3;

export default {
  data() {
    return {
      currentPage: 0,
    };
  },
  computed: {
    recentBooks() {
      return this.$store.getters.getRecentBooks;
    },
    currentBooks() {
      return this.recentBooks.slice(
        this.currentPage * booksPerPage,
        (this.currentPage + 1) * booksPerPage,
      );
    },
    isStart() {
      return this.currentPage === 0;
    },
    isEnd() {
      return this.currentPage === (this.totalPages - 1);
    },
    totalPages() {
      return Math.ceil(this.recentBooks.length / booksPerPage);
    },
    isPaginationNeeded() {
      return this.totalPages > 1;
    },
  },
  methods: {
    prevPage() {
      this.currentPage -= 1;
    },
    nextPage() {
      this.currentPage += 1;
    },
  },
};
</script>

<style scoped>
.recent-books-menu {
  position: absolute;
  bottom: 0;
  padding: 0;
  width: 100%;
  text-align: center;
}
.recent-books-menu-title {
  color: white;
  margin-bottom: 1vh;
}

.recent-books {
  padding: 0;
  list-style: none;
}

.recent-books li {
  width: 100%;
}

.recent-book {
  width: 6vw;
  height: 6vw;
  border-radius: 1vw;
  overflow: hidden;
}

.recent-book:not(:last-of-type) {
  margin-bottom: 1vh;
}

.recent-book-more img {
  width: 100%;
}

.recent-book-more.up img {
  transform: scaleY(-1);
}
</style>
