/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const apiServer = axios.create({
  baseURL: '/api',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

const localAccessToken = localStorage.getItem('access-token');
if (localAccessToken) {
  apiServer.defaults.headers['x-access-token'] = localAccessToken;
}

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem('access-token'),
    books: JSON.parse(localStorage.getItem('books')) || [],
    loading: false,
    currentBook: null,
  },
  getters: {
    getBook: (ctx, getters) => (bid) => getters.getBooks.filter((b) => b.bid === bid)[0],
    getBooks: (ctx) => ctx.books.slice(0, 20).map((m) => ({
      bid: m,
      title: '책제목',
      thumbnail: 'samples/book-thumbnail.svg',
    })),
    getRecentBooks: (ctx) => ctx.books.slice(0, 3).map((m) => ({
      // TODO: 유저별 최근 읽은 책 구현하기
      bid: m,
      title: '',
      thumbnail: 'samples/book-thumbnail.svg',
    })),
  },
  mutations: {
    login(ctx, accessToken) {
      ctx.accessToken = accessToken;
      apiServer.defaults.headers['x-access-token'] = ctx.accessToken;
      localStorage.setItem('access-token', accessToken);
    },
    logout(ctx) {
      ctx.accessToken = null;
      apiServer.defaults.headers['x-access-token'] = null;
      localStorage.removeItem('access-token');
    },
    setBooks(ctx, books) {
      ctx.books = books;
      localStorage.setItem('books', JSON.stringify(books));
    },
    loadFinish(ctx) {
      ctx.loading = false;
    },
    loadStart(ctx) {
      ctx.loading = true;
    },
  },
  actions: {
    login({ commit }, { id, pw }) {
      return new Promise((resolve, reject) => {
        apiServer
          .post('/auth/signin', { id, pw })
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
        apiServer
          .post('/auth/signup', { id, pw, nickname, email, age })
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
        apiServer
          .get(`/auth/id-duplicate-check?id=${id}`)
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
        commit('setBooks', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        resolve();
      });
    },
  },
  modules: {},
});
