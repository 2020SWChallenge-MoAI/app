import Vue from 'vue';

import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import './assets/css/main.css';

Vue.config.productionTip = false;

const requireComponent = require.context('./components', true, /[A-Z]\w+\.(vue|js)$/);

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

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.auth) && store.state.accessToken === null) {
    next('/login');
  } else next();
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
