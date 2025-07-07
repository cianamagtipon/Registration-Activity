import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.use(ElementPlus)

// Disable enter key on open element plus message boxes
function disableEnter(e) {
  if (e.key !== 'Enter') return // only care about enter

  const box = document.querySelector('.el-message-box') // the real dialog
  const visible = box && getComputedStyle(box).display !== 'none'

  if (visible) {
    e.preventDefault()
    e.stopImmediatePropagation() // stop EVERY further handler
  }
}

// Capture phase guarantees we run before element plus
;['keydown', 'keyup'].forEach((type) =>
  window.addEventListener(type, disableEnter, true),
)

app.mount('#app')
