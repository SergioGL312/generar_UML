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
      await this.executeCommand('cd java/ && java -jar java2plantuml.jar src/');
      await this.executeCommand('cd java/ && java -jar plantuml-1.2023.8.jar output.puml');

      res.download('./java/output.png', (err) => {
        if (err) {
          console.error('Hubo un error al descargar el archivo:', err);
        }

        this.deleteFile('./java/output.puml', 'Archivo UML eliminado exitosamente');
        this.deleteFile('./java/output.png', 'Archivo IMG eliminado exitosamente');
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