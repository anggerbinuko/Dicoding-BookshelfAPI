const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Aktifkan CORS
        additionalHeaders: ['Content-Type'], // Tambahkan header yang diizinkan
      },
    },
  });

  // Mendaftarkan routes dari routes.js
  routes.forEach((route) => server.route(route));

  await server.start();
  console.log(`Server berjalan di ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
