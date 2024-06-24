<template>
  <div class="admin-container">
    <h1>Tablero de Administrador</h1>
    <p>Informes generales</p>
    <div class="chart">
      <h2>Visualización del Stock</h2>
      <canvas id="stockBarChart"></canvas>
    </div>
    <div class="lists-form-container">
      <div class="lists">
        <div class="list">
          <h2>Productos Más Vendidos</h2>
          <ProductList :products="mostSoldProducts" :can-toggle-offer="false" />
        </div>
        <div class="list">
          <h2>Productos Menos Vendidos</h2>
          <ProductList :products="leastSoldProducts" @toggle-offer="toggleProductOffer" :can-toggle-offer="true" />
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
      <div class="product-table">
        <div class="product-row header">
          <span>Producto</span>
          <span>Estado</span>
          <span>Acción</span>
        </div>
        <div v-for="product in allProducts" :key="product.id" class="product-row">
          <span>{{ product.name }}</span>
          <span :class="product.enOferta ? 'offer-yes' : 'offer-no'">
            {{ product.enOferta ? 'Sí' : 'No' }}
          </span>
          <button @click="toggleProductOffer(product)">Cambiar Estado</button>
        </div>
      </div>
    </div>
    <div class="sales-list">
      <h2>Listado de Ventas de Productos</h2>
      <ul>
        <li v-for="product in allProducts" :key="product.id">
          {{ product.name }}: {{ product.sales !== undefined ? product.sales : 'No sales data' }} ventas
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductList from '../ProductList.vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, BarController, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, BarController, CategoryScale, LinearScale);

const mostSoldProducts = ref([]);
const leastSoldProducts = ref([]);
const allProducts = ref([]);
const selectedProducts = ref([]);
let stockChart = null;

const newProduct = ref({
  name: '',
  stock: 0,
  precio: '',
  monodroga: '',
  codProd: 0,
  enOferta: false
});

const updateStockChart = () => {
  const stock = allProducts.value.map(product => product.stock);
  const labels = allProducts.value.map(product => product.name);
  const backgroundColors = stock.map(value => value < 5 ? 'red' : value < 10 ? 'orange' : '#66BB6A');

  if (stockChart) {
    stockChart.destroy();
  }

  const ctx = document.getElementById('stockBarChart').getContext('2d');
  stockChart = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Stock',
        backgroundColor: backgroundColors,
        data: stock
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

const fetchProducts = async () => {
  try {
    const [productosResponse, comprasResponse] = await Promise.all([
      axios.get('https://665b22b5003609eda45ff22a.mockapi.io/productos'),
      axios.get('https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/Compras')
    ]);

    const products = productosResponse.data;
    const compras = comprasResponse.data;

    // Crear un diccionario para mapear las cantidades de compras a cada producto
    const ventasPorProducto = {};
    compras.forEach(compra => {
      const productoId = compra.codProd;
      if (ventasPorProducto[productoId]) {
        ventasPorProducto[productoId] += parseInt(compra.cantidad);
      } else {
        ventasPorProducto[productoId] = parseInt(compra.cantidad);
      }
    });

    // Añadir la propiedad 'sales' a cada producto basado en el diccionario de ventas
    products.forEach(product => {
      product.sales = ventasPorProducto[product.codProd] || 0;
    });

    // Ordenar productos por cantidad de ventas de mayor a menor
    const sortedProducts = products.sort((a, b) => b.sales - a.sales);

    // Tomar los 3 productos más vendidos
    mostSoldProducts.value = sortedProducts.slice(0, 3);

    // Tomar los 3 productos menos vendidos
    leastSoldProducts.value = sortedProducts.slice(-3);

    // Guardar todos los productos para la selección
    allProducts.value = products;

    // Actualizar el gráfico
    updateStockChart();
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
};

const saveSelectedProducts = async () => {
  // Actualizar el estado de enOferta en la API
  const updatedProducts = selectedProducts.value.map(product => {
    return axios.put(`https://665b22b5003609eda45ff22a.mockapi.io/productos/${product.id}`, {
      ...product,
      enOferta: true
    });
  });

  try {
    await Promise.all(updatedProducts);
    fetchProducts(); // Actualizar la lista de productos después de guardar
  } catch (error) {
    console.error('Error al actualizar los productos en oferta:', error);
  }

  // Guardar los productos seleccionados en el almacenamiento local
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts.value));
};

const addProduct = async () => {
  try {
    const productResponse = await axios.post('https://665b22b5003609eda45ff22a.mockapi.io/productos', newProduct.value);
    const newProductId = productResponse.data.id;

    // Agregar el nuevo producto a la lista de compras con cantidad 0 inicialmente
    await axios.post('https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/Compras', {
      codProd: newProductId,
      nombre: newProduct.value.name,
      precio: newProduct.value.precio,
      cantidad: 0,
      userId: "9999",
      idCompra: "9999"
    });

    allProducts.value.push(productResponse.data);
    newProduct.value = {
      name: '',
      stock: 0,
      precio: '',
      monodroga: '',
      codProd: 0,
      enOferta: false
    };
    updateStockChart(); // Actualizar el gráfico después de agregar un producto
    fetchProducts(); // Refrescar la lista de productos después de agregar uno nuevo
  } catch (error) {
    console.error('Error al agregar el producto:', error);
  }
};

const toggleProductOffer = async (product) => {
  try {
    product.enOferta = !product.enOferta;
    await axios.put(`https://665b22b5003609eda45ff22a.mockapi.io/productos/${product.id}`, product);
    fetchProducts(); // Actualizar la lista de productos después de guardar
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.admin-container {
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
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
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-selection {
  margin-top: 2rem;
}

.product-table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.product-row {
  display: contents;
}

.header {
  font-weight: bold;
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

.offer-yes {
  color: green;
}

.offer-no {
  color: red;
}

.list ul {
  list-style-type: none;
  padding: 0;
}

.list ul li {
  background: #f0f0f0;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 4px;
}

.chart-container {
  width: 100%;
}

.sales-list {
  margin-top: 2rem;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
