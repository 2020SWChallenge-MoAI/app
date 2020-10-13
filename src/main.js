import Vue from 'vue';
// import Main from './views/main/MainPage.vue';
// import Home from './views/Home.vue';
// import MindMap from './views/main/MindMap.vue';
import MindMap from './views/main/StartMindMap.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(MindMap),
}).$mount('#app');
