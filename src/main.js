import Vue from 'vue'
import App from './App.vue'
import Toolbar from './components/Toolbar.vue'
import Navigation from './components/Navigation.vue'
import Application from './components/Application.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

new Vue({
  router,
  store,
  vuetify,
  render: h => h(Toolbar)
}).$mount('#toolbar')

new Vue({
  router,
  store,
  vuetify,
  render: h => h(Navigation)
}).$mount('#navigation')

new Vue({
  router,
  store,
  vuetify,
  render: h => h(Application)
}).$mount('#application')