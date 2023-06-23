const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

class Generador {
  constructor() {
    this.router = express.Router();
    this.router.get('/generate', this.generarUML.bind(this));
  }

  async generarUML(req, res) {
    try {
      const githubURL = decodeURIComponent(req.query.r);
      const repoName = githubURL.match(/\/([^/]+)$/)[1];
      console.log(repoName);
      await this.executeCommand(`cd java/ && git clone ${githubURL}.git`);

      await this.executeCommand(`cd java/${repoName}/ && java -jar ../java2plantuml.jar src/`);
      await this.executeCommand(`cd java/${repoName}/ && java -jar ../plantuml-1.2023.8.jar output.puml`);

      res.download(`./java/${repoName}/output.png`, (err) => {
        if (err) {
          console.error('Hubo un error al descargar el archivo:', err);
        }

        this.deleteFile(`./java/${repoName}/output.puml`, 'Archivo UML eliminado exitosamente');
        this.deleteFile(`./java/${repoName}/output.png`, 'Archivo IMG eliminado exitosamente');

        this.executeCommand(`rm -rf ./java/${repoName}`)
          .then(() => {
            console.log('Repositorio eliminado exitosamente');
          })
          .catch((err) => {
            console.error('Error al eliminar el repositorio:', err);
          });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al generar la imagen UML.');
    }
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  deleteFile(path, successMessage) {
    fs.unlink(path, (err) => {
      if (err) {
        console.error('Hubo un error al intentar eliminar el archivo:', err);
      } else {
        console.log(successMessage);
      }
    });
  }
}

module.exports = Generador;