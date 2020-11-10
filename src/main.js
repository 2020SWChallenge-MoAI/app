import Vue from 'vue';
import axios from 'axios';

import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import './assets/css/main.css';

Vue.config.productionTip = false;

// import layout components
const requireComponent = require.context('./components/layouts', true, /[A-Z]\w+\.(vue|js)$/);
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(
    camelCase(
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, ''),
    ),
  );

  Vue.component(componentName, componentConfig.default || componentConfig);
});

// access token check
router.beforeEach((to, from, next) => {
  store.dispatch('loadFinish');
  if (to.matched.some((record) => record.meta.auth) && !store.getters.accessToken) {
    next('/login');
  } else next();
});

// access token expire retry
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config && error.response && error.response.status === 401) {
      return new Promise((resolve, reject) => {
        const refresh = store
          .dispatch('refresh')
          .then((token) => {
            const { config } = error;
            config.headers['x-access-token'] = token;
            return config;
          })
          .catch((reason) => {
            if (reason === 'refreshing') setTimeout(refresh, 1000);
            else reject();
          })
          .then((config) => axios.request(config))
          .then(resolve);
      });
    }

    return Promise.reject(error);
  },
);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
