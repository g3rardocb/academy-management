
// backend/server.js

const app = require('./src/index');
const PORT = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
