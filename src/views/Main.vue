<template>
  <base-layout :loading-overlay="false">
    <template v-slot:left>
      <left-menu-button
        text="로그아웃"
        icon="mdi-logout"
        @click.native="logout"
      />
    </template>
    <template v-slot:right>
      <right-menu-items />
    </template>
    <ul id="tabs-category">
      <li
        v-for="(category, index) in categories"
        :key="index"
        class="tab"
        :class="{ active: index == currentCategory }"
        @click="currentCategory = index"
      >
        {{ category }}
      </li>
    </ul>
    <div id="content">
      <div id="tooltip">
        함께 읽을 책을 선택해보자!
      </div>
      <v-carousel
        v-model="currentPage"
        :show-arrows="false"
        :cycle="false"
        :hide-delimiter-background="true"
        class="bookshelf"
        height="100%"
      >
        <v-carousel-item
          v-for="(page, pageIndex) in pages"
          :key="pageIndex"
          class="bookshelf-page"
        >
          <div class="books">
            <div
              v-for="(row, rowIndex) in rows"
              :key="rowIndex"
              class="book-row"
            >
              <div class="bookshelf-bar" />
              <book
                v-for="book in row"
                :key="book.bid"
                :book="book"
                :clicked="book.bid === selectedBook"
                @click.native="read(book.bid)"
              />
              <dummy-book
                v-for="n in (booksPerRow - row.length)"
                :key="n"
              />
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </div>
  </base-layout>
</template>

<script>
import Book from '../components/views/main/Book.vue';
import DummyBook from '../components/views/main/DummyBook.vue';

export default {
  components: {
    Book, DummyBook,
  },
  data() {
    return {
      currentPage: 0,
      currentCategory: 0,
      selectedBook: null,
      booksPerRow: 4,
      rowsPerPage: 2,
    };
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    books() {
      return this.$store.getters.categoryBooks(this.categories[this.currentCategory]);
    },
    totalPages() {
      return Math.ceil(this.books.length / this.booksPerPage);
    },
    booksPerPage() {
      return this.booksPerRow * this.rowsPerPage;
    },
    pages() {
      const pages = [];
      for (let i = 0; i < this.totalPages; i += 1) {
        pages.push(this.books.slice(i * this.booksPerPage, (i + 1) * this.booksPerPage));
      }

      return pages;
    },
    rows() {
      return this.pages[this.currentPage]
        .reduce((rows, book, index) => {
          rows[Math.floor(index / this.booksPerRow)].push(book);
          return rows;
        }, [...new Array(this.rowsPerPage)].map(() => []));
    },
  },
  watch: {
    currentCategory() {
      this.currentPage = 0;
    },
  },
  async created() {
    this.$store.dispatch('loadStart');
    if (!this.$store.getters.bookLoaded) await this.$store.dispatch('downloadBooks');
    this.$store.dispatch('loadFinish');
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.replace('/login');
    },
    read(bid) {
      if (this.selectedBook !== bid) {
        this.selectedBook = bid;
        return;
      }

      this.$store.dispatch('readBook', bid);
      this.$router.push('/read');
    },
  },
};
</script>

<style lang="scss" scoped>
#tabs-category {
  margin: 0 20px 0 20px;
  padding: 0;
  overflow-x: scroll;
  border-radius: 1vmax 1vmax 0 0;
  display: flex;
  list-style: none;
}

#tabs-category > *:not(:last-child) {
  margin-right: 1vmax;
}

#tabs-category::-webkit-scrollbar {
  display: none;
}

.tab {
  min-width: 12vmax;
  padding: 1vmin 0 1vmin 0;
  background: #83b1b1;
  border-radius: 1vmax 1vmax 0 0;
  font-size: 2vmin;
  text-align: center;
  color: #ffffff;
}

.tab:active,
.tab.active {
  background: #668d8d;
}

#content {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-flow: column;
  width: 100%;
  height: calc(100% - 4vmin);
  background: rgba(255, 253, 242, 0.6);
  border-radius: 1vmax;
  overflow: hidden;
}

#tooltip {
  margin: 1vmax 1vmax 0 0;
  background: #ffffff;
  padding: 1vmax;
  font-size: 2vmin;
  border-radius: 1vmax;
  text-align: center;
  min-width: 50%;
  align-self: flex-end;
  display: block;
}

.bookshelf-page {
  height: 100%;
}

.bookshelf-bar {
  width: 100%;
  height: 5vmin;
  background: rgba(156, 138, 108, 0.8);
  position: absolute;
  bottom: -2.5vmin;
  left: 0;
}

.books {
  list-style: none;
  display: flex;
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  padding: 0;
}

.book-row {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding: 0 4vmax;
  margin-top: 10vmin;
}

.btn-right-menu {
  margin-top: 1vmax;
}

/* change v-carousel navigator button color */
::v-deep .v-carousel__controls .v-btn .v-icon {
  color: #24b1a1 !important;
}
::v-deep .v-carousel__controls__item {
  color: #24b1a1 !important;
}
</style>
