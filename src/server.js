const express = require('express');
const routes = require('./routes');

const app = express();
const port = 9000;

// Middleware untuk mengaktifkan CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware untuk parsing JSON body
app.use(express.json()); // Tambahkan ini untuk mem-parsing body request yang berupa JSON

// Menggunakan routes yang didefinisikan di routes.js
app.use('/', routes);

// Start server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
