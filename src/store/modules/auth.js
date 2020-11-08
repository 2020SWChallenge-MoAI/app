/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-newline */
import axios from 'axios';

const localAccessToken = localStorage.getItem('access-token');
const localRefreshToken = localStorage.getItem('refresh-token');

if (localAccessToken) {
  axios.defaults.headers['x-access-token'] = localAccessToken;
}

const authModule = {
  state: {
    accessToken: localAccessToken || '',
    refreshing: false,
  },
  getters: {
    accessToken: (state) => state.accessToken,
  },
  mutations: {
    setToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setRefreshing(state, refreshing) {
      state.refreshing = refreshing;
    },
    removeToken(state) {
      state.accessToken = '';
    },
  },
  actions: {
    login({ commit }, { id, pw }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/auth/signin', { id, pw })
          .then(({ data }) => {
            const accessToken = data['access-token'];
            const refreshToken = data['refresh-token'];

            axios.defaults.headers['x-access-token'] = accessToken;
            localStorage.setItem('access-token', accessToken);
            localStorage.setItem('refresh-token', refreshToken);
            commit('setToken', accessToken);

            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    logout({ commit }) {
      delete axios.defaults.headers['x-access-token'];
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      commit('removeToken');
    },
    refresh({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.refreshing) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('refreshing');
          return;
        }

        commit('setRefreshing', true);
        axios
          .get('/api/auth/refresh', { headers: { 'x-refresh-token': localRefreshToken } })
          .then(({ data }) => {
            const token = data['access-token'];
            axios.defaults.headers['x-access-token'] = token;
            localStorage.setItem('access-token', token);
            commit('setToken', token);
            commit('setRefreshing', false);
            resolve(token);
          })
          .catch(reject);
      });
    },
    signup(context, { id, pw, nickname, email, age }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/auth/signup', {
            id,
            pw,
            nickname,
            email,
            age,
          })
          .then(resolve)
          .catch(reject);
      });
    },
    checkId(context, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/auth/id-duplicate-check?id=${id}`)
          .then(resolve)
          .catch(reject);
      });
    },
  },
};

export default authModule;
