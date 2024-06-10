<template>
    <div>
      <h1>Home Page</h1>
      <h2>Productos en Oferta</h2>
      <ul>
        <li v-for="product in productsOnSale" :key="product.id">
          {{ product.name }} - Precio: {{ product.precio }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const productsOnSale = ref([]);
  
  const fetchProductsOnSale = async () => {
    try {
      const response = await axios.get('https://665b22b5003609eda45ff22a.mockapi.io/productos');
      const products = response.data.filter(product => product.enOferta);
      productsOnSale.value = products;
    } catch (error) {
      console.error('Error al obtener los productos en oferta:', error);
    }
  };
  
  onMounted(() => {
    fetchProductsOnSale();
  });
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
  }
  </style>
  