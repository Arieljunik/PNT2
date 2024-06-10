<template>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - Ventas: {{ product.sales }}
      </li>
    </ul>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    products: {
      type: Array,
      required: true
    }
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
  