<template>
    <nav v-if="!route.meta.hideNavbar">
        <ul>
            <li>
                <RouterLink to="/">Home</RouterLink> 
            </li>
            <li>
                <RouterLink to="/carrito">Carrito</RouterLink>
            </li>
            <li>
                <p>{{ userStore.currentUser.email }}, {{ userStore.currentUser.rol }}</p>
            </li>
            <li>
                <button @click="userStore.logout()">Logout</button>
            </li>
        </ul>
    </nav>
</template>
<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { useUserStore } from '../stores/UserStore';

const userStore = useUserStore()
const route = useRoute()

</script>
<style>
nav {
    background-color: rgb(46, 46, 46);
}
nav ul {
    list-style-type: none;
}
nav li {
    display: inline-block;
    padding-inline: 10px;
}
</style>