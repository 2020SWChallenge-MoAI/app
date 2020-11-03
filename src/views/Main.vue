<template>
  <base-layout :loading-overlay="true">
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
        height="calc(100% - 3vw - 2vh)"
      >
        <div
          id="bookshelf-bar-1"
          class="bookshelf-bar"
        />
        <div
          id="bookshelf-bar-2"
          class="bookshelf-bar"
        />
        <v-carousel-item
          v-for="(page, index) in pages"
          :key="index"
          class="bookshelf-page"
        >
          <div class="books">
            <book
              v-for="book in page"
              :key="book.bid"
              :book="book"
              :clicked="book.bid === currentBook"
              @click.native="currentBook = book.bid"
              @read="read(book)"
            />
          </div>
        </v-carousel-item>
      </v-carousel>
    </div>
  </base-layout>
</template>

<script>
import Book from '../components/views/main/Book.vue';

const booksPerPage = 8;

export default {
  components: {
    Book,
  },
  data() {
    return {
      currentPage: 0,
      currentCategory: 0,
      currentBook: null,
    };
  },
  computed: {
    categories() {
      return this.$store.getters.getCategories;
    },
    totalPages() {
      return Math.ceil(this.books.length / booksPerPage);
    },
    pages() {
      const pages = [];
      for (let i = 0; i < this.totalPages; i += 1) {
        pages.push(this.books.slice(i * booksPerPage, (i + 1) * booksPerPage));
      }

      return pages;
    },
    books() {
      return this.$store.getters.getCategoryBooks(this.categories[this.currentCategory]);
    },
  },
  watch: {
    currentCategory() {
      this.currentPage = 0;
    },
  },
  async created() {
    this.$store.commit('loadStart');
    if (!this.$store.getters.isBookLoaded) await this.$store.dispatch('getBooks');
    this.$store.commit('loadFinish');
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.replace('/login');
    },
    read(book) {
      this.$store.commit('setCurrentBook', book);
      this.$router.push('/read');
    },
  },
};
</script>

<style scoped>
#tabs-category {
  margin: 0 20px 0 20px;
  padding: 0;
  overflow-x: scroll;
  border-radius: 1vw 1vw 0 0;
  display: flex;
  list-style: none;
}

#tabs-category > *:not(:last-child) {
  margin-right: 1vw;
}

#tabs-category::-webkit-scrollbar {
  display: none;
}

.tab {
  min-width: 12vw;
  padding: 1vh 0 1vh 0;
  background: #83b1b1;
  border-radius: 1vw 1vw 0 0;
  font-size: 2vh;
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
  height: calc(100% - 4vh);
  background: rgba(255, 253, 242, 0.6);
  border-radius: 1vw;
  overflow: hidden;
}

#tooltip {
  margin: 1vw 1vw 0 0;
  background: #ffffff;
  padding: 1vw;
  font-size: 2vh;
  border-radius: 1vw;
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
  height: 5vh;
  background: rgba(156, 138, 108, 0.8);
}

#bookshelf-bar-1 {
  position: absolute;
  top: 28vh;
}

#bookshelf-bar-2 {
  position: absolute;
  top: 58vh;
}

.books {
  list-style: none;
  display: flex;
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
}

.books > * {
  margin-top: 8vh;
  margin-right: calc((78vw - 18vh * 4 - 16vw) / 3);
}
.books > *:nth-child(4n + 0) {
  margin-right: 0;
}

.btn-right-menu {
  margin-top: 1vw;
}

/* change v-carousel navigator button color */
/deep/ .v-carousel__controls .v-btn .v-icon {
  color: #24b1a1 !important;
}
/deep/ .v-carousel__controls__item {
  color: #24b1a1 !important;
}
</style>
