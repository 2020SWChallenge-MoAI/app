<template>
  <div class="recent-books-menu">
    <p class="recent-books-menu-title">
      읽은책
    </p>
    <ul class="recent-books">
      <li
        class="recent-book-more up"
        :class="{active: !isStart}"
        @click="prevPage"
      >
        <img src="@/assets/img/layouts/base/left/more.svg">
      </li>
      <li
        v-for="(book, index) in currentBooks"
        :key="index"
        class="recent-book"
        @click="selectBook(book.bid)"
      >
        <book-menu-button :book="book" />
      </li>
      <li
        v-for="n in (2 - currentBooks.length)"
        :key="n"
        class="recent-book"
      >
        <book-menu-dummy-button />
      </li>
      <li
        class="recent-book-more down"
        :class="{active: !isEnd}"
        @click="nextPage"
      >
        <img src="@/assets/img/layouts/base/left/more.svg">
      </li>
    </ul>
  </div>
</template>

<script>
const booksPerPage = 2;

export default {
  data() {
    return {
      page: 0,
    };
  },
  computed: {
    recentBooks() {
      return this.$store.getters.recentBooks;
    },
    currentBooks() {
      return this.recentBooks.slice(
        this.page * booksPerPage,
        (this.page + 1) * booksPerPage,
      );
    },
    isStart() {
      return this.page === 0;
    },
    isEnd() {
      if (!this.totalPages) return true;
      return this.page === (this.totalPages - 1);
    },
    totalPages() {
      return Math.ceil(this.recentBooks.length / booksPerPage);
    },
  },
  async created() {
    await this.$store.dispatch('downloadRecentBids');
  },
  methods: {
    prevPage() {
      if (this.isStart) return;
      this.page -= 1;
    },
    nextPage() {
      if (this.isEnd) return;
      this.page += 1;
    },
    selectBook(bid) {
      this.$store.dispatch('setCurrentBook', bid);
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
  font-size: 1.5vw;
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
  opacity: 0.5;
  width: 100%;
}

.recent-book-more.up img {
  transform: scaleY(-1);
}

.recent-book-more.active img {
  opacity: 1.0;
}
</style>
