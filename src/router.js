import { createRouter, createWebHistory } from 'vue-router'
import Siswa from './views/Siswa.vue'
import Marshal from './views/Marshal.vue'
import Penulis from './views/Penulis.vue'

const routes = [
  { path: '/', name: 'Siswa', component: Siswa },
  { path: '/simulasi_tka', name: 'SimulasiTka', component: Siswa },
  { path: '/marshal', name: 'Marshal', component: Marshal },
  { path: '/admin', redirect: '/marshal' },
  { path: '/penulis', name: 'Penulis', component: Penulis },
  { path: '/guru', redirect: '/penulis' },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
