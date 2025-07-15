// index.js (Título 1)
// Carga variables de entorno y arranca el servidor

require('dotenv').config();             // Carga .env en process.env
const http = require('http');
const app = require('./app');            // Importa la configuración de Express

const PORT = process.env.PORT || 3000;   // Puerto configurable

// Crea el servidor HTTP a partir de la app de Express
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
