import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import MindMap from '../views/main/MindMap.vue';
import MindMapS from '../views/main/StartMindMap.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/mindmap',
    name: 'MindMap',
    component: MindMap,
  },
  {
    path: '/mindmap/start',
    name: 'StartMindMap',
    component: MindMapS,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
