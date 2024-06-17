// loadProductos.js

import axios from 'axios';

const apiUrl = 'https://665b22b5003609eda45ff22a.mockapi.io/productos';

// Lista de productos a crear
const productos = [
    {
      "name": "Ibupirac 600 mg comp x 30",
      "stock": 20,
      "precio": "4500.00",
      "monodroga": "Ibuprofeno",
      "codProd": 6001,
      "enOferta": false
    },
    {
      "name": "Bayaspirina 500 mg comp x 30",
      "stock": 20,
      "precio": "1500.00",
      "monodroga": "Acido acetil salicilico",
      "codProd": 6002,
      "enOferta": false
    },
    {
      "name": "Aziatop 20 mg caps.x 14",
      "stock": 20,
      "precio": "8500.00",
      "monodroga": "omeprazol",
      "codProd": 6003,
      "enOferta": false
    },
    {
      "name": "Optamox Duo 1 g comp.x 14",
      "stock": 20,
      "precio": "2500.00",
      "monodroga": "amoxicilina+clavulánico",
      "codProd": 6004,
      "enOferta": false
    },
    {
      "name": "Cieldom 10 g f.a.x 200 ml",
      "stock": 20,
      "precio": "108500.00",
      "monodroga": "inmunoglobulina humana",
      "codProd": 6005,
      "enOferta": false
    },
    {
      "name": "HUMIRA AC X 2 (20 MG) 20mg/0.2ml jer.prell.x 2",
      "stock": 20,
      "precio": "250000.00",
      "monodroga": "adalimumab",
      "codProd": 6006,
      "enOferta": false
    },
    {
      "name": "Herceptin 440 mg/50 ml a.x 1",
      "stock": 20,
      "precio": "180000.00",
      "monodroga": "trastuzumab",
      "codProd": 6007,
      "enOferta": false
    },
    {
      "name": "Perjeta 420 mg/14 ml a.x 1",
      "stock": 20,
      "precio": "95000.00",
      "monodroga": "pertuzumab",
      "codProd": 6008,
      "enOferta": false
    },
    {
      "name": "Enerceptan 25 mg jga.prell.x 4",
      "stock": 20,
      "precio": "52000.00",
      "monodroga": "etanercept",
      "codProd": 6009,
      "enOferta": false
    },
    {
      "name": "Atripla comp.x 30",
      "stock": 20,
      "precio": "352000.00",
      "monodroga": "efavirenz+emtricitabina+tenofov",
      "codProd": 6010,
      "enOferta": false
    }
  ];

// Función para obtener los productos actuales de la API
export const obtenerProductosActuales = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('Error al obtener productos:', error);
  }
};

// Función para borrar los productos existentes en la API
export const borrarProductos = async (productosExist) => {
  try {
    for (let i = 0; i < productosExist.length; i++) {
      const producto = productosExist[i];
      await axios.delete(`${apiUrl}/${producto.id}`);
      console.log(`Producto ${producto.name} eliminado de la API.`);
    }
    console.log('Se han borrado todos los productos existentes en la API.');
  } catch (error) {
    console.error('Error al borrar productos:', error);
    throw new Error('Error al borrar productos:', error);
  }
};

// Función para crear los productos en la API
export const crearProductos = async () => {
  try {
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      await axios.post(apiUrl, producto);
      console.log(`Producto ${producto.name} creado en la API.`);
    }
    console.log('Se han creado todos los productos en la API.');
  } catch (error) {
    console.error('Error al crear productos:', error);
    throw new Error('Error al crear productos:', error);
  }
};
