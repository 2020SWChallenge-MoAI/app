import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Activity from '../views/Activity.vue'
import ActivityList from '../views/ActivityList.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/book',
    name: 'Book',
    component: () => import(/* webpackChunkName: "about" */ '../views/Book.vue')
  },
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('../views/Activity.vue')
  },
  {
    path: '/activityList',
    name: 'ActivityList',
    component: () => import('../views/ActivityList.vue')
  },
  {
    path: '/activity/choose',
    name: 'ActivityChoose',
    component: () => import('../views/ActivityChoose.vue')
  },
  {
    path: '/quizgame',
    name: 'QuizGame',
    component: () => import('../views/QuizGame.vue')
  },
  {
    path: '/mindmap',
    name: 'MindMap',
    component: () => import('../views/MindMap.vue')
  },
  {
    path: '/gamewF',
    name: 'GameWF',
    component: () => import('../views/GameWF.vue')
  },
  {
    path: '/gamewB',
    name: 'GameWB',
    component: () => import('../views/GameWB.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('../views/Game.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
