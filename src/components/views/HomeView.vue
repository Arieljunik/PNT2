<template>
  <div>
    <h1>Home Page</h1>
    <h2>Productos en Oferta</h2>

    <!-- Esta es la lista de productos hecha con <table> -->
    <!-- <table>
      <tbody>
        <tr v-for="product in productsOnSale" :key="product.id">
          <td>
            <input
              type="checkbox"
              :value="product.id"
              v-model="selectedProductsIds"
              @change="toggleProductSelection(product)"
            />
          </td>
          <td>{{ product.name }}</td>
          <td>${{ product.precio }}</td>
          <td><input
        type="number"
        min="1"
        v-model.number="productQuantities[product.id]"
        @input="updateQuantity(product.id, $event.target.value)"
        placeholder="Cantidad"
        class="quantity-input"
      /></td>
        </tr>
      </tbody>
    </table> -->
    
    <div
      v-for="product in productsOnSale"
      :key="product.id"
      :class="['product-button', { selected: isSelected(product.id) }]"
    >
    
      <input
        type="checkbox"
        :value="product.id"
        v-model="selectedProductsIds"
        @change="toggleProductSelection(product)"
      />
      <span class="product-name">{{ product.name }}</span>
      <span class="product-price">\${{ product.precio }}</span>
      <input
        type="number"
        min="1"
        v-model.number="productQuantities[product.id]"
        @input="updateQuantity(product.id, $event.target.value)"
        placeholder="Cantidad"
        class="quantity-input"
      />
    </div>

    <h2>Buscar Productos</h2>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Buscar productos..."
      class="search-input"
    />

    <!-- Esta es la lista de productos hecha con <table> -->
    <!-- <table>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>
            <input
              type="checkbox"
              :value="product.id"
              v-model="selectedProductsIds"
              @change="toggleProductSelection(product)"
            />
          </td>
          <td>{{ product.name }}</td>
          <td class="product-price">${{ product.precio }}</td>
          <td><input
        type="number"
        min="1"
        v-model.number="productQuantities[product.id]"
        @input="updateQuantity(product.id, $event.target.value)"
        placeholder="Cantidad"
        class="quantity-input"
      /></td>
        </tr>
      </tbody>
    </table> -->

    <div
      v-for="product in filteredProducts"
      :key="product.id"
      :class="['product-button', { selected: isSelected(product.id) }]"
    >
      <input
        type="checkbox"
        :value="product.id"
        v-model="selectedProductsIds"
        @change="toggleProductSelection(product)"
      />
      <span class="product-name">{{ product.name }}</span>
      <span class="product-price">\${{ product.precio }}</span>
      <input
        type="number"
        min="1"
        v-model.number="productQuantities[product.id]"
        @input="updateQuantity(product.id, $event.target.value)"
        placeholder="Cantidad"
        class="quantity-input"
      />
    </div>

    <h2>Productos Seleccionados</h2>
    <div v-for="product in selectedProducts" :key="product.id" class="selected-product">
      <p><strong>Nombre:</strong> {{ product.name }}</p>
      <p><strong>Precio:</strong> \${{ product.precio }}</p>
      <p><strong>Cantidad:</strong> {{ product.cantidad }}</p>
      <p><strong>Código de Producto:</strong> {{ product.codProd }}</p>
    </div>

    <!-- Botón para enviar los productos seleccionados a la API -->
    <button @click="sendSelectedProducts" class="send-button">Enviar Productos Seleccionados</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const allProducts = ref([]);
const productsOnSale = ref([]);
const selectedProductsIds = ref([]); // Lista de IDs de productos seleccionados
const productQuantities = ref({}); // Mapa para las cantidades de cada producto
const selectedProducts = ref([]); // Lista de productos seleccionados con detalles y cantidad
const searchQuery = ref(''); // Consulta de búsqueda
const router = useRouter()

const fetchAllProducts = async () => {
  try {
    const response = await axios.get('https://665b22b5003609eda45ff22a.mockapi.io/productos');
    allProducts.value = response.data;
    const productsOnSaleFiltered = response.data.filter(product => product.enOferta).map(product => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      precio: product.precio,
      monodroga: product.monodroga,
      codProd: product.codProd,
      enOferta: product.enOferta
    }));
    productsOnSale.value = productsOnSaleFiltered;
    // Inicializar las cantidades de cada producto a 1
    allProducts.value.forEach(product => {
      productQuantities.value[product.id] = 1;
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
};

// Función para verificar si un producto está seleccionado
const isSelected = (productId) => {
  return selectedProductsIds.value.includes(productId);
};

// Función para actualizar la cantidad de un producto
const updateQuantity = (productId, quantity) => {
  const productIndex = selectedProducts.value.findIndex(product => product.id === productId);
  if (productIndex !== -1) {
    selectedProducts.value[productIndex].cantidad = quantity;
  }
  productQuantities.value[productId] = quantity;
};

// Función para añadir o eliminar un producto de la lista de productos seleccionados
const toggleProductSelection = (product) => {
  const productIndex = selectedProducts.value.findIndex(selected => selected.id === product.id);
  if (productIndex === -1) {
    selectedProducts.value.push({
      ...product,
      cantidad: productQuantities.value[product.id]
    });
  } else {
    selectedProducts.value.splice(productIndex, 1);
  }
  console.log("Productos seleccionados:", selectedProducts.value);
};

// Propiedad computada para filtrar productos basados en la consulta de búsqueda
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  const query = searchQuery.value.toLowerCase();
  return allProducts.value.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.monodroga.toLowerCase().includes(query)
  );
});

// Función para enviar los productos seleccionados a la API externa
const sendSelectedProducts = async () => {
  try {
    const sendRequests = selectedProducts.value.map(product => axios.post('https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/carrito', {
      nombre: product.name,
      precio: product.precio,
      cantidad: product.cantidad,
      codProducto: product.codProd
    }));
    const responses = await Promise.all(sendRequests);
    console.log('Productos enviados exitosamente:', responses.map(response => response.data));
    router.push('/carrito')
  } catch (error) {
    console.error('Error al enviar los productos:', error);
  }
};

onMounted(() => {
  fetchAllProducts();
});
</script>

<style>
.product-button {
  display: flex;
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
  background-color: #eb0f0f;
  border-color: #888;
}

.product-name {
  font-weight: bold;
}

.product-price {
  color: #28a745;
}

.quantity-input {
  margin-left: 10px;
  width: 60px;
}

.selected-product {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
}

.search-input {
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
  text-align: left;
}

</style>

