import Vue from 'vue';
import VueRouter from 'vue-router';

/* Router Views */
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Main from '../views/Main.vue';
import MyPage from '../views/MyPage.vue';
import Read from '../views/Read.vue';
import QuizGameIntro from '../views/activity/quiz-game/QuizGameIntro.vue';
import QuizGameCreation from '../views/activity/quiz-game/QuizGameCreation.vue';
import QuizGameSolving from '../views/activity/quiz-game/QuizGameSolving.vue';
import WritingIntro from '../views/activity/writing/WritingIntro.vue';
import Writing from '../views/activity/writing/Writing.vue';
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
    path: '/activity/quiz-game/intro',
    alias: '/activity/quiz-game',
    name: 'QuizGameIntro',
    component: QuizGameIntro,
    meta: { auth: true },
  },
  {
    path: '/activity/quiz-game/solving',
    alias: '/activity/quiz-game',
    name: 'QuizGameSolving',
    component: QuizGameSolving,
    meta: { auth: true },
  },
  {
    path: '/activity/quiz-game/creation',
    alias: '/activity/quiz-game',
    name: 'QuizGameCreation',
    component: QuizGameCreation,
    meta: { auth: true },
  },
  {
    path: '/activity/writing/intro',
    alias: '/activity/writing',
    name: 'WritingIntro',
    component: WritingIntro,
    meta: { auth: true },
  },
  {
    path: '/activity/writing/process',
    name: 'Writing',
    component: Writing,
    props: (route) => ({ rank: route.query.rank }),
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
