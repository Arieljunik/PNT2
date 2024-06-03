
<template>
    <Bar :data="chartData" />
  </template>
  
  <script setup>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, CategoryScale, LinearScale)
  
  defineProps({
    chartData: {
      type: Object,
      required: true
    }
  })
  </script>