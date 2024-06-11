<template>
  <ul class="product-list">
    <li v-for="product in products" :key="product.id" class="product-item">
      <div class="product-info">
        <span>{{ product.name }}</span>
        <span>Ventas: {{ product.sales }}</span>
        <span :class="product.enOferta ? 'offer-yes' : 'offer-no'">
          En oferta: {{ product.enOferta ? 'Sí' : 'No' }}
        </span>
        <button v-if="canToggleOffer" @click="toggleOffer(product)">Cambiar En oferta</button>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  canToggleOffer: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(['toggle-offer']);

const toggleOffer = (product) => {
  emits('toggle-offer', product);
};
</script>

<style scoped>
.product-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
}

.product-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
  width: 100%;
  max-width: 600px;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  background-color: #42A5F5;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #1E88E5;
}

.offer-yes {
  color: green;
}

.offer-no {
  color: red;
}
</style>
