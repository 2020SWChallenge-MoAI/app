/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const apiServer = axios.create({
  baseURL: 'http://localhost:7002/api',
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
    books: [],
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
      return apiServer.get('/book/').then(({ data }) => commit('setBooks', data.bids));
    },
  },
  modules: {},
});
