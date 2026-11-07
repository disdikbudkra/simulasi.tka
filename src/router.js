import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Guru from './views/Guru.vue'
import Siswa from './views/Siswa.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/siswa', name: 'Siswa', component: Siswa },
  { path: '/guru', name: 'Guru', component: Guru },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
