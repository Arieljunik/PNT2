import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './components/views/HomeView.vue'
import LoginView from './components/views/LoginView.vue'
import ConfirmacionView from './components/views/ConfirmacionView.vue'
import CarritoView from './components/views/CarritoView.vue'
import AdminView from './components/views/AdminView.vue'
import { useUserStore } from './stores/UserStore'

const router = createRouter({
    routes: [
        {
<<<<<<< HEAD
            path: '/home',
            component: HomeView
=======
            path: '/',
            component: HomeView,
            meta: { requiresAuth: true }
>>>>>>> b8d58938ac71ad3cd69296f44732df08c719c864
        },  {
            path: '/login',
            component: LoginView,
            meta: { hideNavbar: true }
        },  {
            path: '/confirmacion',
            component: ConfirmacionView,
            meta: { requiresAuth: true }
        },  {
            path: '/carrito',
            component: CarritoView,
            meta: { requiresAuth: true }
        },
        { 
            path: '/admin', 
            component: AdminView,
            meta: { 
                requiresAuth: true,
                requiresAdmin: true 
            } 
        }
    ],
    history: createWebHistory()
})

const pinia = createPinia()

router.beforeEach((to, from) => {
    const userStore = useUserStore();
    
    // redireccion a "login" si no hay usuario logueado
    if (to.meta.requiresAuth && !userStore.isUserAutenticated) {
        return '/login';
    }

    // cancela redireccion si el usuario es admin y no es una pagina para ese rol
    if(!to.meta.requiresAdmin && userStore.isAdmin) {
        return '/admin'
    }

    // cancela redireccion si el usuario no es admin
    if(to.meta.requiresAdmin && !userStore.isAdmin) {
        return '/'
    }
});

createApp(App)
.use(router)
.use(pinia)
.mount('#app')