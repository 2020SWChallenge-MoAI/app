import Vue from 'vue';
import VueRouter from 'vue-router';

/* Router Views */
import Login from '../views/auth/Login.vue';
import Signup from '../views/auth/Signup.vue';
import Main from '../views/main/Main.vue';
import Read from '../views/main/book/reading/ReadBook.vue';
import MindMap from '../views/main/MindMap.vue';
import MindMapS from '../views/main/StartMindMap.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    alias: '/',
    meta: { auth: true },
  },
  {
    path: '/read/:bid',
    name: 'Read',
    component: Read,
    meta: { auth: true },
  },
  {
    path: '/activity/mindmap/view/:bid',
    name: 'MindMap',
    component: MindMap,
    meta: { auth: true },
  },
  {
    path: '/activity/mindmap/start',
    name: 'StartMindMap',
    component: MindMapS,
    meta: { auth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
