// Importar Express
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
  app.get('/conteoIngresosRangoFechas', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    //Para la fecha de hoy, seleccionar la misma fecha en los limites del rango
    db.query(`
    SELECT
    fecha,
    hora,
    SUM(total_ingresos) AS total_ingresos,
    SUM(total_egresos) AS total_egresos
    FROM (
    SELECT fecha, hora, SUM(total_ingresos) AS total_ingresos, SUM(total_egresos) AS total_egresos
    FROM (
        SELECT DATE_FORMAT(fecha_ingreso, '%Y-%m-%d') AS fecha, DATE_FORMAT(hora_ingreso, '%H:%i') AS hora, COUNT(*) AS total_ingresos, 0 AS total_egresos
        FROM Ingresos
        WHERE fecha_ingreso BETWEEN ? AND ?
        GROUP BY fecha, hora

        UNION ALL

        SELECT DATE_FORMAT(fecha_egreso, '%Y-%m-%d') AS fecha, DATE_FORMAT(hora_egreso, '%H:%i') AS hora, 0 AS total_ingresos, COUNT(*) AS total_egresos
        FROM Egresos
        WHERE fecha_egreso BETWEEN ? AND ?
        GROUP BY fecha, hora
    ) AS union_table
    GROUP BY fecha, hora
    ) AS totals
    GROUP BY fecha, hora;
    `, [fechaInicio, fechaFin], (err, result) => {
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
  //Suponiendo que desde el arduino, la db se llena con esos ids al registrar el color
  app.get('/ingresosRolRangoFechas', (req, res) => {
    const { fechaInicio, fechaFin} = req.query;
    
    db.query(`
      SELECT 
        fecha_ingreso AS fecha,
        SUM(CASE WHEN id_rol = 1 THEN 1 ELSE 0 END) AS Estudiantes,
        SUM(CASE WHEN id_rol = 2 THEN 1 ELSE 0 END) AS Trabajadores,
        SUM(CASE WHEN id_rol = 3 THEN 1 ELSE 0 END) AS Catedraticos,
        SUM(CASE WHEN id_rol = 4 THEN 1 ELSE 0 END) AS Ajenos
      FROM Ingreso
      WHERE fecha_ingreso BETWEEN ? AND ?
      GROUP BY fecha_ingreso;
    `, [fechaInicio, fechaFin], (err, result) => {
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
  app.get('/ingresosPersonasRangoFechas', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    
    db.query(`
    SELECT 
      fecha_ingreso AS fecha,
      SUM(CASE WHEN id_vehiculo = 1 THEN 1 ELSE 0 END) AS Personal,
      SUM(CASE WHEN id_vehiculo = 2 THEN 1 ELSE 0 END) AS Mediano,
      SUM(CASE WHEN id_vehiculo = 3 THEN 1 ELSE 0 END) AS Grande
    FROM Ingreso
    WHERE fecha_ingreso BETWEEN ? AND ?
    GROUP BY fecha_ingreso;
    `, [fechaInicio, fechaFin], (err, result) => {
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