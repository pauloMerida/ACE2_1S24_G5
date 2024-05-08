const { TextDecoder } = require('util'); 
const express = require('express');
const mysql = require('mysql2');
const app = express();
const decoder = new TextDecoder();
const cors = require('cors'); // Importar el paquete cors
const bodyParser = require('body-parser');

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
    host: '18.191.195.73',//ip elastica
    user: 'paulo',
    password: '12345',
    database: 'proyecto2'
  });

    // Conectar a la base de datos
    connection.connect(function(err) {
        if (err) {
          console.error('Error al conectar a la base de datos:', err);
          return;
        }
        console.log('Conexión a la base de datos establecida');
      });
    
    app.use(cors()); // Habilitar CORS
    app.use(bodyParser.json());
  
app.get('/',(req,res)=>res.send('Hola bienvenido al home'));
  // Endpoint para obtener todos los ingresos
  app.get('/todosingresos', function(req, res) {
    connection.query('CALL todos_ingresos();', function(err, results) {
        if (err) {
            console.error('Error al obtener datos de la base de datos:', err);
            res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
            return;
        }
        res.json(results[0]);
    });
});
  
  // Endpoint para obtener todos los egresos
  app.get('/todosegresos', function(req, res) {
    connection.query('CALL todos_egresos();', function(err, results) {
        if (err) {
            console.error('Error al obtener datos de la base de datos:', err);
            res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
            return;
        }
        res.json(results[0]);
    });
});

app.get('/login', function(req, res) {
    connection.query('select * from Logueo;', function(err, results) {
        if (err) {
            console.error('Error al obtener datos de la base de datos:', err);
            res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
            return;
        }
        res.json(results[0]);
    });
});
  /*
  // Endpoint para obtener los ingresos dentro de un rango de fechas
  app.get('/fechasingresos', (req, res) => {
    const { fechaInicial, fechaFinal } = req.query;
    connection.query('SELECT * FROM Ingresos WHERE fecha BETWEEN ? AND ?', [fechaInicial, fechaFinal], (err, results) => {
      if (err) {
        console.error('Error al obtener los ingresos por fechas:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.json(results);
    });
  });
  
  // Endpoint para obtener los egresos dentro de un rango de fechas
  app.get('/fechasegresos', (req, res) => {
    const { fechaInicial, fechaFinal } = req.query;
    connection.query('SELECT * FROM Egresos WHERE fecha BETWEEN ? AND ?', [fechaInicial, fechaFinal], (err, results) => {
      if (err) {
        console.error('Error al obtener los egresos por fechas:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.json(results);
    });
  });
*/
  // Iniciar el servidor
const port = 2000;
app.listen(port, function() {
    console.log(`Servidor escuchando en el puerto ${port}`);
});