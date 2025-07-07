import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajusta si tu backend tiene otro puerto o ruta base
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
