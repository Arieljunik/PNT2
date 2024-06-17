<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div>
    <RouterLink to="/home">Home</RouterLink> |
    <RouterLink to="/carrito">Carrito</RouterLink>
  </div>
  <RouterView></RouterView>
</template>



<script>
import { onMounted } from 'vue';
import { obtenerProductosActuales, borrarProductos, crearProductos } from './loadProductos';

export default {
  mounted() {
    this.cargarProductos();
  },
  methods: {
    async cargarProductos() {
      try {
        const productosActuales = await obtenerProductosActuales();
        await borrarProductos(productosActuales);
        await crearProductos();
        console.log('Proceso de carga de productos completado.');
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }
  }
};
</script>




<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
