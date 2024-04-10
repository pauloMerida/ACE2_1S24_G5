const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');  // Asegúrate de importar el módulo 'path'

//const SerialPort = require('serialport');
//const Readline = require('@serialport/parser-readline');
//const port = new SerialPort('COM3', { baudRate: 9600 }); // Reemplaza 'COM3' con el nombre de tu puerto

// Crear una instancia de Express
const app = express();
const PORT = 3000;

app.use(cors());

// Definir una ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});


// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'prueba',
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
    } else {
      console.log('Conexión exitosa a la base de datos');
    }
  });
  
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

  //Conteo de ingresos y egresos para el día actual
  app.get('/conteoIngresosEgresosFechas', (req, res) => {
    //Se recibe el rango de fechas desde react
    const { fechaInicio, fechaFin } = req.query; // Enviar con formato YYYY/MM/DD
    //Para la fecha de hoy, seleccionar la misma fecha en los limites del rango
    db.query('call Consultar_Ingresos_Egresos(?,?);', [fechaInicio, fechaFin], (err, result) => {
      if (err) {
        console.error('Error al obtener conteo de ingresos y egresos por rango de fecha:', err);
        res.status(500).send('Error al obtener el conteo de ingresos y egresos de hoy por rango de fecha');
      } else {
        res.json(result);
      }
    });
  });

  //1 Estudiantes
  //2 Trabajadores
  //3 Catedraticos
  //4 Otros
  app.get('/vehiculosRolRangoFechas', (req, res) => {
    //Se recibe el rango de fechas desde react
    const { fechaInicio, fechaFin} = req.query; // Enviar con formato YYYY/MM/DD
    
    db.query('call Vehiculos_Por_Rol_Intervalo_Fechas(?,?);', [fechaInicio, fechaFin], (err, result) => {
      if (err) {
        console.error('Error al obtener conteo de ingresos por fecha y rol:', err);
        res.status(500).send('Error al obtener el conteo de ingresos por fecha y rol');
      } else {
        res.json(result);
      }
    });
  });

  //1 Personal
  //2 Mediano
  //3 Grande
  app.get('/sumaPersonasRangoFechas', (req, res) => {
    //Se recibe el rango de fechas desde react
    const { fechaInicio, fechaFin } = req.query; // Enviar con formato YYYY/MM/DD
    
    db.query('call Suma_personas_porIntervaloFechas(?,?);', [fechaInicio, fechaFin], (err, result) => {
      if (err) {
        console.error('Error al obtener conteo de personas por fecha:', err);
        res.status(500).send('Error al obtener el conteo de personas por fecha');
      } else {
        res.json(result);
      }
    });
  });

  app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
  });