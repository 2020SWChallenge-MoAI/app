/* eslint-disable no-param-reassign */
const appStateModule = {
  namespaced: false,
  state: {
    appLoading: false,
    appError: false,
    errorMessage: '오류가 발생했습니다.',
    popup: false,
    popupType: '',
    popupMessage: '',
  },
  getters: {
    appLoading: (state) => state.appLoading,
    appError: (state) => state.appError,
    errorMessage: (state) => state.errorMessage,
    popup: (state) => state.popup,
    popupType: (state) => state.popupType,
    popupMessage: (state) => state.popupMessage,
  },
  mutations: {
    setAppLoading(state, loading) {
      state.appLoading = loading;
    },
    setAppError(state, error) {
      state.appError = error;
    },
    setErrorMessage(state, message) {
      state.errorMessage = message;
    },
    setPopup(state, popup) {
      state.popup = popup;
    },
    setPopupType(state, type) {
      state.popupType = type;
    },
    setPopupMessage(state, message) {
      state.popupMessage = message;
    },
  },
  actions: {
    loadStart({ commit }) {
      commit('setAppLoading', true);
      commit('setAppError', false);
    },
    loadFinish({ commit }) {
      commit('setAppError', false);
      commit('setAppLoading', false);
    },
    showError({ commit }, message) {
      commit('setErrorMessage', message);
      commit('setAppError', true);
      commit('setAppLoading', false);
    },
    hideError({ commit }) {
      commit('setAppError', false);
    },
    showMessage({ commit }, { mode, message }) {
      commit('setPopupType', mode);
      commit('setPopupMessage', message);
      commit('setPopup', true);
    },
  },
};

export default appStateModule;
