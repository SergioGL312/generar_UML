const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/generate', (req, res) => {
  exec(`java -jar java2plantuml.jar src/`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al ejecutar el archivo jar.');
    }

    res.download(`./output.puml`);
  });
});

app.listen(3000, () => {
  console.log('Server is running . . .');
});
