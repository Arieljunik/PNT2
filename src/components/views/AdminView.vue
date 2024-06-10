<template>
  <div class="admin-container">
    <h1>Admin Page</h1>
    <p>Welcome, Admin!</p>
    <div class="content-grid">
      <div class="chart">
        <h2>Ventas de Productos</h2>
        <LineChart :chart-data="salesData" />
      </div>
      <div class="chart">
        <h2>Stock de Productos</h2>
        <BarChart :chart-data="stockData" />
      </div>
    </div>
    <div class="lists-form-container">
      <div class="lists">
        <div class="list">
          <h2>Productos Más Vendidos</h2>
          <ProductList :products="mostSoldProducts" />
        </div>
        <div class="list">
          <h2>Productos Menos Vendidos</h2>
          <ProductList :products="leastSoldProducts" />
        </div>
      </div>
      <div class="add-product">
        <h2>Agregar Nuevo Producto</h2>
        <form @submit.prevent="addProduct">
          <label for="name">Nombre:</label>
          <input type="text" id="name" v-model="newProduct.name" placeholder="Nombre del producto" required>

          <label for="stock">Stock (unidades):</label>
          <input type="number" id="stock" v-model="newProduct.stock" placeholder="Stock en unidades" required>

          <label for="precio">Precio:</label>
          <input type="text" id="precio" v-model="newProduct.precio" placeholder="Precio del producto" required>

          <label for="monodroga">Monodroga:</label>
          <input type="text" id="monodroga" v-model="newProduct.monodroga" placeholder="Monodroga" required>

          <label for="codProd">Código de Producto:</label>
          <input type="number" id="codProd" v-model="newProduct.codProd" placeholder="Código de producto" required>

          <label for="enOferta">En Oferta:</label>
          <input type="checkbox" id="enOferta" v-model="newProduct.enOferta">

          <button type="submit">Agregar Producto</button>
        </form>
      </div>
    </div>
    <div class="product-selection">
      <h2>Seleccionar Productos en Oferta</h2>
      <div v-for="product in allProducts" :key="product.id" class="checkbox-container">
        <input type="checkbox" :id="product.id" :value="product" v-model="selectedProducts">
        <label :for="product.id">{{ product.name }}</label>
      </div>
      <button @click="saveSelectedProducts">Guardar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LineChart from '../charts/LineChart.vue';
import BarChart from '../charts/BarChart.vue';
import ProductList from '../ProductList.vue';

const salesData = ref({
  labels: [],
  datasets: [
    {
      label: 'Ventas',
      backgroundColor: '#42A5F5',
      data: []
    }
  ]
});

const stockData = ref({
  labels: [],
  datasets: [
    {
      label: 'Stock',
      backgroundColor: '#66BB6A',
      data: []
    }
  ]
});

const mostSoldProducts = ref([]);
const leastSoldProducts = ref([]);
const allProducts = ref([]);
const selectedProducts = ref([]);

const newProduct = ref({
  name: '',
  stock: 0,
  precio: '',
  monodroga: '',
  codProd: 0,
  enOferta: false
});

const fetchProducts = async () => {
  try {
    const response = await axios.get('https://665b22b5003609eda45ff22a.mockapi.io/productos');
    const products = response.data;

    // Procesar datos para los gráficos
    const sales = products.map(product => product.sales);
    const stock = products.map(product => product.stock);
    const labels = products.map(product => product.name);

    salesData.value.labels = labels;
    salesData.value.datasets[0].data = sales;

    stockData.value.labels = labels;
    stockData.value.datasets[0].data = stock;

    // Ordenar productos por cantidad de ventas de mayor a menor
    const sortedProducts = products.sort((a, b) => b.sales - a.sales);

    // Tomar los 3 productos más vendidos
    mostSoldProducts.value = sortedProducts.slice(0, 3);

    // Tomar los 3 productos menos vendidos
    leastSoldProducts.value = sortedProducts.slice(-3);

    // Guardar todos los productos para la selección
    allProducts.value = products;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
};

const saveSelectedProducts = async () => {
  // Actualizar el estado de enOferta a true en la API
  const updatedProducts = selectedProducts.value.map(product => {
    return axios.put(`https://665b22b5003609eda45ff22a.mockapi.io/productos/${product.id}`, {
      ...product,
      enOferta: true
    });
  });

  try {
    await Promise.all(updatedProducts);
    alert('Productos en oferta actualizados con éxito');
    fetchProducts(); // Actualizar la lista de productos después de guardar
  } catch (error) {
    console.error('Error al actualizar los productos en oferta:', error);
  }

  // Guardar los productos seleccionados en el almacenamiento local
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts.value));
};

const addProduct = async () => {
  try {
    const response = await axios.post('https://665b22b5003609eda45ff22a.mockapi.io/productos', newProduct.value);
    allProducts.value.push(response.data);
    newProduct.value = {
      name: '',
      stock: 0,
      precio: '',
      monodroga: '',
      codProd: 0,
      enOferta: false
    };
    alert('Producto agregado con éxito');
  } catch (error) {
    console.error('Error al agregar el producto:', error);
  }
};

onMounted(() => {
  fetchProducts();

  // Cargar productos seleccionados desde el almacenamiento local
  const savedProducts = JSON.parse(localStorage.getItem('selectedProducts'));
  if (savedProducts) {
    selectedProducts.value = savedProducts;
  }
});
</script>

<style scoped>
.admin-container {
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  align-items: start;
}

.lists-form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.chart, .list, .add-product {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-selection {
  margin-top: 2rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.add-product form {
  display: flex;
  flex-direction: column;
}

.add-product input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-product label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.add-product button {
  background-color: #42A5F5;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

.add-product button:hover {
  background-color: #1E88E5;
}
</style>
