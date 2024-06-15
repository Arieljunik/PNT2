<template>
  <div>
    <h1>Lista de Productos</h1>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div
        v-for="producto in productos"
        :key="producto.id"
        :class="['product-button', { selected: producto.id === selectedProducto?.id }]"
        @click="selectProducto(producto)"
      >
      <span class="product-name">{{ producto.name }}</span>
      <span class="product-price">\${{ producto.precio }}</span>
        <span v-if="producto.id === selectedProducto?.id" class="checkmark">✔</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Datos reactivos
const productos = ref([]);
const selectedProducto = ref([]);
const loading = ref(true);
const error = ref(null);

// Función para obtener los datos de la API y transformarlos
const fetchProductos = async () => {
  try {
    const response = await axios.get('https://665b22b5003609eda45ff22a.mockapi.io/productos');
    productos.value = response.data.map(producto => ({
      id: producto.id,
      name: producto.name,
      stock: producto.stock,
      precio: producto.precio,
      monodroga: producto.monodroga,
      codProd: producto.codProd,
      enOferta: producto.enOferta


      // Puedes añadir más propiedades aquí si lo deseas
    }));
  } catch (err) {
    error.value = 'Error fetching items: ' + err.message;
  } finally {
    loading.value = false;
  }
};

// Función para seleccionar un producto
const selectProducto = (producto) => {
  selectedProducto.value = producto;
};

// Llama a fetchProductos cuando el componente se monta
onMounted(fetchProductos);
</script>

<style>
.product-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: background-color 0.3s, border-color 0.3s;
}

.product-button:hover {
  background-color: #e0e0e0;
}

.selected {
  background-color: #d3d3d3;
  border-color: #888;
}

.checkmark {
  color: green;
  font-size: 1.5em;
  margin-left: 10px;
}

.product-name {
  font-weight: bold;
}

.product-price {
  color: #28a745;
}
</style>
