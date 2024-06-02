<template>
    <div>
      <h2>Carrito de Compras</h2>
      <div v-if="loading">Cargando...</div>
      <div v-if="error">{{ error }}</div>
      <table v-if="!loading && !error && cart.length">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Precio Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.unitPrice.toFixed(2) }}</td>
            <td>{{ (item.quantity * item.unitPrice).toFixed(2) }}</td>
            <td><button @click="removeFromCart(item.id)">Eliminar</button></td>
          </tr>
          <tr>
            <td colspan="3"><b>Total</b></td>
            <td><b>{{ getTotal().toFixed(2) }}</b></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !error && !cart.length">No hay productos en el carrito.</div>
      <button v-if="!loading && !error && cart.length" @click="confirmCart">Confirmar Carrito</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // Estado del componente
  const cart = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  // Función para obtener datos de la API
  async function fetchCart() {
    try {
      const response = await axios.get('https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/carrito');
      console.log(response.data); // Depuración: Verifica los datos recibidos
      cart.value = response.data.map(item => ({
        id: item.id,
        name: item.Descripcion, // Utilizar Descripcion como nombre
        quantity: item.Cantidad, // Utilizar Cantidad como cantidad
        unitPrice: parseFloat(item.Precio) || 0 // Utilizar Precio como precio unitario
      })).filter(item => item.unitPrice); // Filtrar los elementos con precio válido
    } catch (err) {
      console.error(err); // Depuración: Imprime el error en la consola
      error.value = 'Error al cargar los datos del carrito';
    } finally {
      loading.value = false;
    }
  }
  
 // Función para eliminar un producto del carrito
async function removeFromCart(id) {
  try {
    // Enviar solicitud DELETE para eliminar el elemento de la API
    await axios.delete(`https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/carrito/${id}`);
    
    // Actualizar el carrito local eliminando el elemento correspondiente
    cart.value = cart.value.filter(item => item.id !== id);

    console.log('Producto eliminado del carrito correctamente');
  } catch (err) {
    console.error(err); // Depuración: Imprime el error en la consola
    error.value = 'Error al eliminar el producto del carrito';
  }
}

  
  // Función para obtener el total del carrito
  function getTotal() {
    return cart.value.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  }
  
// Función para confirmar el carrito
// Función para confirmar el carrito

async function confirmCart() {
  try {
    const cartToConfirm = cart.value.filter(item => !item.deleted); // Filtrar elementos no eliminados
    const deletePromises = cart.value.filter(item => item.deleted).map(item => axios.delete(`https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/carrito/${item.id}`));
    
    // Esperar a que todas las solicitudes DELETE se completen antes de continuar
    await Promise.all(deletePromises);

    // Actualizar el estado del carrito local para incluir solo los elementos no eliminados
    cart.value = cartToConfirm;

    console.log('Carrito confirmado correctamente');
  } catch (err) {
    console.error(err); // Depuración: Imprime el error en la consola
    error.value = 'Error al confirmar el carrito';
  }
}


  
  // Llamar a la función fetchCart cuando el componente se monta
  onMounted(fetchCart);
  </script>
  
  <style scoped>
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
  
  button {
    background-color: #ff6666;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:hover {
    background-color: #ff4c4c;
  }
  </style>
  