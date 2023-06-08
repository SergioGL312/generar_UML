const express = require('express');
const { exec } = require('child_process');
const app = express();
const fs = require('fs');

app.get('/generate', (req, res) => {
  exec(`cd java/ && java -jar java2plantuml.jar src/`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al ejecutar el archivo jar.');
    }

    exec(`cd java/ && java -jar plantuml-1.2023.8.jar output.puml`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al generar la imagen UML.');
      }
      res.download(`./java/output.png`, (err) => {
        if (err) {
          console.error('Hubo un error al descargar el archivo:', err);
        }

        fs.unlink('./java/output.puml', (err) => {
          if (err) {
            console.error('Hubo un error al intentar eliminar el archivo:', err);
          } else {
            console.log('Archivo UML eliminado exitosamente');
          }
        });

        fs.unlink('./java/output.png', (err) => {
          if (err) {
            console.error('Hubo un error al intentar eliminar el archivo:', err);
          } else {
            console.log('Archivo IMG eliminado exitosamente');
          }
        });
      });
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running . . .');
});
