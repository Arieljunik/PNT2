<template>
    <Line :data="chartData" />
  </template>
  
  <script setup>
  import { Line } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
  
  defineProps({
    chartData: {
      type: Object,
      required: true
    }
  })
  </script>
  