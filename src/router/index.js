import Vue from 'vue';
import VueRouter from 'vue-router';

/* Router Views */
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Main from '../views/Main.vue';
import MyPage from '../views/MyPage.vue';
import Read from '../views/Read.vue';
import QuizGame from '../views/activity/QuizGame.vue';
import Writing from '../views/activity/Writing.vue';
import BeforeDrawing from '../views/activity/drawing/ChooseSentence.vue';
import Drawing from '../views/activity/drawing/Drawing.vue';
import MindMap from '../views/activity/mindmap/MindMap.vue';
import StartMindMap from '../views/activity/mindmap/ChooseTemplate.vue';
import FinishMindMap from '../views/activity/mindmap/FinishMindMap.vue';

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
    path: '/mypage',
    name: 'MyPage',
    component: MyPage,
    meta: { auth: true },
  },
  {
    path: '/read',
    name: 'Read',
    component: Read,
    meta: { auth: true },
  },
  {
    path: '/activity/mindmap/start',
    name: 'MindMap',
    component: MindMap,
    meta: { auth: true },
  },
  {
    path: '/activity/mindmap/',
    name: 'StartMindMap',
    component: StartMindMap,
    meta: { auth: true },
  },
  {
    path: '/activity/mindmap/finish',
    name: 'FinishMindMap',
    component: FinishMindMap,
    meta: { auth: true },
  },
  {
    path: '/activity/quiz-game',
    name: 'QuizGame',
    component: QuizGame,
    meta: { auth: true },
  },
  {
    path: '/activity/writing',
    name: 'Writing',
    component: Writing,
    meta: { auth: true },
  },
  {
    path: '/activity/drawing',
    name: 'BeforeDrawing',
    component: BeforeDrawing,
    meta: { auth: true },
  },
  {
    path: '/activity/drawing/start',
    name: 'Drawing',
    component: Drawing,
    meta: { auth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
