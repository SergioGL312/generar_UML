const express = require('express');
const app = express();

// Routes
const UMLGeneradorController = require('./routes/generadorUML');

// Instance
const umlGenerador = new UMLGeneradorController();

app.use('/', umlGenerador.router);

app.listen(3000, () => {
  console.log('Server is running . . .');
});
