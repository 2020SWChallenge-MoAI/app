/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import axios from 'axios';
import _ from 'lodash';
import localForage from 'localforage';
import util from '../../util';

const bookModule = {
  state: {
    books: [],
    recentBids: [],
    currentBid: null,
  },
  getters: {
    book: (state) => (bid) => state.books.find((b) => b.bid === bid),
    recentBooks: (state) => state.recentBids.map((bid) => state.books[bid]),
    categoryBooks: (state) => (category) => state.books.filter((b) => b.category === category),
    categories: (state) => _.uniq(state.books.filter((b) => b.category).map((b) => b.category)),
    currentBook: (state, getters) => getters.book(state.currentBid),
    bookLoaded: (state) => state.books.length > 0,
  },
  mutations: {
    setBooks(state, books) {
      state.books = books;
    },
    setBookCover(state, { bid, cover }) {
      state.books.find((b) => b.bid === bid).thumbnail = cover;
    },
    setRecentBids(state, bids) {
      state.recentBids = bids;
    },
    setCurrentBid(state, bid) {
      state.currentBid = bid;
    },
  },
  actions: {
    downloadBooks({ commit, dispatch }) {
      return localForage
        .getItem('books')
        .then((localBooks) => {
          if (localBooks) return Promise.resolve(localBooks);
          return axios.get('/api/book').then(({ data }) => {
            const books = data.books.map((b) => ({
              bid: b.bid,
              title: b.title,
              author: b.author,
              category: b.category,
              pageNum: b.page_num,
              imageNum: b.image_num,
              thumbnail: '',
            }));

            localForage.setItem('books', books);
            return Promise.resolve(books);
          });
        })
        .then((books) => {
          commit('setBooks', books);
          books.map((b) => dispatch('downloadBookCover', b.bid));
        });
    },
    downloadBookPage({ commit }, { bid, page }) {
      return localForage.getItem(`book-${bid}-page-${page}`).then((localBookPage) => {
        if (localBookPage) return Promise.resolve(localBookPage);
        return util.base64(`/api/book/${bid}/${page}`).then((bookPage) => {
          localForage.setItem(`book-${bid}-page-${page}`, bookPage);
          return Promise.resolve(bookPage);
        });
      });
    },
    downloadBookMainImage({ commit }, { bid, rank, thumbnail }) {
      const localForageKey = thumbnail
        ? `book-${bid}-mainimage-${rank}-thumbnail`
        : `book-${bid}-mainimage-${rank}`;
      const downloadUrl = thumbnail
        ? `/api/book/${bid}/main-image?rank=${rank}&thumbnail=true`
        : `/api/book/${bid}/main-image?rank=${rank}`;

      return new Promise((resolve, reject) => {
        localForage.getItem(localForageKey).then(async (localMainImage) => {
          const mainImage = localMainImage || (await util.base64(downloadUrl));

          resolve(mainImage);

          if (!localMainImage) localForage.setItem(localForageKey, mainImage);
        });
      });
    },
    downloadBookCover({ commit }, bid) {
      return new Promise((resolve, reject) => {
        localForage.getItem(`book-${bid}-cover`).then(async (localCover) => {
          const cover = localCover || (await util.base64(`/api/book/${bid}/cover`));

          commit('setBookCover', { bid, cover });
          resolve(cover);

          if (!localCover) localForage.setItem(`book-${bid}-cover`, cover);
        });
      });
    },
    downloadRecentBids({ commit, dispatch, getters }) {
      return new Promise((resolve, reject) => {
        let bookLoadedState = Promise.resolve();
        if (!getters.bookLoaded) bookLoadedState = dispatch('downloadBooks');

        bookLoadedState.then(() => {
          axios.get('/api/user/book').then(async ({ data }) => {
            const bids = data.read_book_bids.map((b) => b.bid);

            commit('setRecentBids', bids);
            resolve();
          });
        });
      });
    },
    setCurrentBook({ commit }, bid) {
      commit('setCurrentBid', bid);
    },
    readBook({ commit }, bid) {
      return new Promise((resolve, reject) => {
        commit('setCurrentBid', bid);
        axios.post(`/api/book/${bid}/read`, { bid });
      });
    },
  },
};

export default bookModule;
