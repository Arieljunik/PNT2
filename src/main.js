import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './components/views/HomeView.vue'
import LoginView from './components/views/LoginView.vue'
import ConfirmacionView from './components/views/ConfirmacionView.vue'
import CarritoView from './components/views/CarritoView.vue'

const router = createRouter({
    routes: [
        {
            path: '/',
            component: HomeView
        },  {
            path: '/login',
            component: LoginView,
            meta: { hideNavbar: true }
        },  {
            path: '/confirmacion',
            component: ConfirmacionView
        },  {
            path: '/carrito',
            component: CarritoView
        }
    ],
    history: createWebHistory()
})

const pinia = createPinia()

createApp(App)
.use(router)
.use(pinia)
.mount('#app')