import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
