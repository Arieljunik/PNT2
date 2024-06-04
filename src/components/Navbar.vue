<template>
    <nav v-if="!route.meta.hideNavbar">
        <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/carrito">Carrito</RouterLink></li>
            <li>{{ userStore.currentUser.email }}, {{ userStore.currentUser.rol }}</li>
            <li><RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink></li>
            <li><button @click="userStore.logout()">Logout</button></li>
        </ul>
    </nav>
</template>
<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { useUserStore } from '../stores/UserStore';
const userStore = useUserStore();
const route = useRoute()

const isAdmin = userStore.isAdmin;
</script>
<style>
nav {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

nav a {
  color: white;
  margin: 0 1rem;
  text-decoration: none;
}
nav ul {
    list-style-type: none;
}
nav li {
    display: inline-block;
    padding-inline: 10px;
}
</style>