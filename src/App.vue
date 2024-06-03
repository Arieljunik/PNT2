<template>
  <div>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/carrito">Carrito</RouterLink> |
      <RouterLink to="/confirmacion">Confirmacion</RouterLink> |
      <RouterLink to="/login">Login</RouterLink> |
      <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>
    </nav>
    <main>
      <RouterView></RouterView>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useUserStore } from './stores/UserStore';

const userStore = useUserStore();
const isAdmin = userStore.isAdmin;
</script>

<style scoped>
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

main {
  padding: 5rem 2rem 2rem;
}
</style>
