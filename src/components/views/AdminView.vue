<template>
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, Admin!</p>
      <div class="charts">
        <div class="chart">
          <h2>Ventas de Productos</h2>
          <LineChart :chart-data="salesData" />
        </div>
        <div class="chart">
          <h2>Stock de Productos</h2>
          <BarChart :chart-data="stockData" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import LineChart from '../charts/LineChart.vue'
  import BarChart from '../charts/BarChart.vue'
  
  const salesData = ref({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Ventas',
        backgroundColor: '#42A5F5',
        data: [40, 20, 12, 39, 10, 40]
      }
    ]
  })
  
  const stockData = ref({
    labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'],
    datasets: [
      {
        label: 'Stock',
        backgroundColor: '#66BB6A',
        data: [60, 55, 30, 80, 90]
      }
    ]
  })
  </script>
  
  <style scoped>
  .charts {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .chart {
    width: 80%;
    margin: 2rem 0;
  }
  </style>
  