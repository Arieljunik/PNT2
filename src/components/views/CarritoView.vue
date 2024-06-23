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
    console.log('Datos recibidos del carrito:', response.data); // Depuración: Verifica los datos recibidos
    cart.value = response.data.map(item => ({
      id: item.id,
      name: item.nombre, // Utilizar nombre como nombre
      quantity: item.cantidad, // Utilizar cantidad como cantidad
      unitPrice: parseFloat(item.precio) || 0, // Utilizar precio como precio unitario
      codProducto: item.codProducto // Suponiendo que codProducto está en los datos de la API
    }));
    console.log('Carrito mapeado:', cart.value); // Depuración: Verifica los datos mapeados
  } catch (err) {
    console.error('Error al cargar los datos del carrito:', err); // Depuración: Imprime el error en la consola
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
    console.error('Error al eliminar el producto del carrito:', err); // Depuración: Imprime el error en la consola
    error.value = 'Error al eliminar el producto del carrito';
  }
}

// Función para obtener el total del carrito
function getTotal() {
  return cart.value.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

// Función para actualizar el stock de los productos
async function updateProductStock(item) {
  try {
    // Obtener el producto actual de la API
    const productResponse = await axios.get(`https://665b22b5003609eda45ff22a.mockapi.io/productos?codProd=${item.codProducto}`);
    const product = productResponse.data[0];

    if (!product) {
      throw new Error(`Producto con codProd ${item.codProducto} no encontrado`);
    }

    // Calcular el nuevo stock
    const newStock = product.stock - item.quantity;

    // Enviar solicitud PUT para actualizar el stock del producto
    await axios.put(`https://665b22b5003609eda45ff22a.mockapi.io/productos/${product.id}`, {
      ...product,
      stock: newStock
    });

    console.log(`Stock del producto ${item.codProducto} actualizado correctamente`);
  } catch (err) {
    console.error(`Error al actualizar el stock del producto ${item.codProducto}:`, err); // Depuración: Imprime el error en la consola
    error.value = `Error al actualizar el stock del producto ${item.codProducto}`;
  }
}

// Función para confirmar el carrito
async function confirmCart() {
  try {
    // Obtener el próximo número de compra disponible
    const purchasesResponse = await axios.get('https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/Compras');
    const nextPurchaseId = purchasesResponse.data.length ? Math.max(...purchasesResponse.data.map(p => p.idCompra)) + 1 : 1;

    console.log('Next Purchase ID:', nextPurchaseId); // Depuración: Verificar el ID de la próxima compra

    // Crear las promesas para enviar cada ítem del carrito y actualizar el stock
    const confirmPromises = cart.value.map(async item => {
      const data = {
        codProd: item.codProducto,
        nombre: item.name,
        precio: item.unitPrice,
        cantidad: item.quantity,
        userId: '9999', // Usar 9999 como userId
        idCompra: nextPurchaseId,
        id: item.id
      };
      console.log('Enviando datos de compra:', data); // Depuración: Verificar los datos enviados

      // Confirmar compra
      await axios.post('https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/Compras', data);
      
      // Actualizar el stock del producto
      await updateProductStock(item);
    });

    // Esperar a que todas las solicitudes POST y actualizaciones de stock se completen
    await Promise.all(confirmPromises);

    console.log('Compras registradas y stock actualizado correctamente');

    // Crear las promesas para eliminar todos los elementos del carrito
    const deletePromises = cart.value.map(item => axios.delete(`https://665ca0c93e4ac90a04da2a33.mockapi.io/PNT2/carrito/${item.id}`));
    // Esperar a que todas las solicitudes DELETE se completen
    await Promise.all(deletePromises);
    console.log('Todos los elementos del carrito eliminados correctamente');

    // Limpiar el carrito local
    cart.value = [];

    console.log('Carrito limpiado correctamente');
  } catch (err) {
    console.error('Error al confirmar el carrito:', err); // Depuración: Imprime el error en la consola
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

  