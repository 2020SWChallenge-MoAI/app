/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const localAccessToken = localStorage.getItem('access-token');
if (localAccessToken) {
  axios.defaults.headers['x-access-token'] = localAccessToken;
}

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem('access-token'),
    books: JSON.parse(localStorage.getItem('books')) || [],
    recentBookIds: [],
    appLoading: false,
    appError: false,
    error: false,
    errorMessage: '',
    success: false,
    successMessage: '',
    currentBook: null,
  },
  getters: {
    getBook: (ctx, getters) => (bid) => getters.getBooks.filter((b) => b.bid === bid)[0],
    getBooks: (ctx) => ctx.books.map((b) => ({
      bid: b.bid,
      title: b.title,
      author: b.author,
      category: b.category,
      thumbnail: `/api/book/${b.bid}/cover`,
      pageNum: b.page_num,
    })),
    isBookLoaded: (ctx) => ctx.books.length > 0,
    isLoading: (ctx) => ctx.appLoading,
    getCategories: (ctx, getters) => [...new Set(getters.getBooks.map((b) => b.category))],
    // eslint-disable-next-line max-len
    // eslint-disable-next-line arrow-body-style
    getCategoryBooks: (ctx, getters) => {
      return (category) => getters.getBooks.filter((b) => b.category === category);
    },
    // eslint-disable-next-line max-len
    getRecentBooks: (ctx, getters) => ctx.recentBookIds.map((b) => getters.getBook(b)),
    getCurrentBook: (ctx) => ctx.currentBook,
  },
  mutations: {
    login(ctx, accessToken) {
      ctx.accessToken = accessToken;
      axios.defaults.headers['x-access-token'] = ctx.accessToken;
      localStorage.setItem('access-token', accessToken);
    },
    logout(ctx) {
      ctx.accessToken = null;
      axios.defaults.headers['x-access-token'] = null;
      localStorage.removeItem('access-token');
    },
    setBooks(ctx, books) {
      ctx.books = books;
      localStorage.setItem('books', JSON.stringify(books));
    },
    loadFinish(ctx) {
      ctx.appLoading = false;
    },
    loadStart(ctx) {
      ctx.appLoading = true;
    },
    setCurrentBook(ctx, book) {
      ctx.currentBook = book;
      const index = ctx.recentBookIds.indexOf(book.bid);
      if (index > -1) ctx.recentBookIds.splice(index, 1);
      ctx.recentBookIds.unshift(book.bid);
    },
    setSuccessMessage(ctx, message) {
      ctx.successMessage = message;
    },
    setErrorMessage(ctx, message) {
      ctx.errorMessage = message;
    },
    showSuccess(ctx) {
      ctx.success = true;
    },
    showError(ctx) {
      ctx.error = true;
    },
  },
  actions: {
    login({ commit }, { id, pw }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/auth/signin', { id, pw })
          .then(({ data }) => {
            commit('login', data['access-token']);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    logout({ commit }) {
      commit('logout');
    },
    signup({ commit }, { id, pw, nickname, email, age }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/auth/signup', { id, pw, nickname, email, age })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    checkId({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/auth/id-duplicate-check?id=${id}`)
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getBooks({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get('/api/book')
          .then(({ data }) => {
            commit('setBooks', data.books);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    showMessage({ commit }, { mode, message }) {
      if (mode === 'success') {
        commit('setSuccessMessage', message);
        commit('showSuccess');
      } else if (mode === 'error') {
        commit('setErrorMessage', message);
        commit('showError');
      }
    },
  },
  modules: {},
});
