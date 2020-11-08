/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

import book from './modules/book';
import auth from './modules/auth';
import appState from './modules/appState';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    book,
    auth,
    appState,
  },
});
