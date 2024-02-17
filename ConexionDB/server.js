

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');  

//const SerialPort = require('serialport');
//const Readline = require('@serialport/parser-readline');
//const port = new SerialPort('COM3', { baudRate: 9600 }); // Reemplaza 'COM3' con el nombre de tu puerto

const app = express();
const PORT = 3000;

app.use(cors());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: '12345', //contrasena de la db
  database: 'prueba', // nombre de la db
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
    } else {
      console.log('Conexión exitosa a la base de datos');
    }
  });
  
  // Consulta a la tabla ingresos
  app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM Ingresos', (err, result) => {
      if (err) {
        console.error('Error al obtener usuarios desde la base de datos:', err);
        res.status(500).send('Error al obtener usuarios desde la base de datos');
      } else {
        res.json(result);
      }
    });

  });


  //Consulta a la tabla egresos
  app.get('/egresos', (req, res) => {
    db.query('SELECT * FROM Egresos', (err, result) => {
      if (err) {
        console.error('Error al obtener usuarios desde la base de datos:', err);
        res.status(500).send('Error al obtener usuarios desde la base de datos');
      } else {
        res.json(result);
      }
    });

  });

  



  
  app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
  });
  