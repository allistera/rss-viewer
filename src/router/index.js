import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import ArticleView from '../components/ArticleView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: ArticleView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router