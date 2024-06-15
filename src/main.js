import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './components/views/HomeView.vue'
import LoginView from './components/views/LoginView.vue'
import ConfirmacionView from './components/views/ConfirmacionView.vue'
import CarritoView from './components/views/CarritoView.vue'

const router = createRouter({
    routes: [
        {
            path: '/home',
            component: HomeView
        },  {
            path: '/login',
            component: LoginView
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

createApp(App)
.use(router)
.mount('#app')
