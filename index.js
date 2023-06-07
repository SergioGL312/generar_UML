const express = require('express');
const { exec } = require('child_process');
const app = express();

const sourceDiretory = './java/src/';
const outputDirectory = './java';

app.get('/generate', (req, res) => {
  exec(`java -jar ${outputDirectory}/java2plantuml.jar ${sourceDiretory}`, (err, stdout, stderr) => { // > ${outputDirectory}output_${uniqueId}.puml
    if (err) {
      console.error(err);
      return res.status(500).send('Error al ejecutar el archivo jar.');
    }

    exec(`java -jar ${outputDirectory}/plantuml-1.2023.8.jar output.puml`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al generar la imagen UML.');
      }
      res.download(`output.png`);
    });

  });
});   

app.listen(3000, () => {
  console.log('Server is running . . .');
});
