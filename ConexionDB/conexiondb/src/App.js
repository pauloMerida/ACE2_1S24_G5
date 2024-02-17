
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import './style.css'; // Importa el archivo CSS de estilos
import DatePicker from 'react-datepicker'; // Importa el componente DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Importa los estilos del DatePicker

function App() {

  const [conteo, setConteo] = useState({});
  const [banner,mostrarBanner] = useState(true)
  const [conteoRoles, setConteoRol] = useState({});
  const [tablaEgresos, setTablaEgresos] = useState([]);
  const [tablaIngresos, setIngresos] = useState([]);
  const [cargando, setCargandoDatos] =useState(true)

  //constantes para calcular la grafica de espacios libres
  const [totalIngresos,setTotalIngresos] = useState(0)
  const [totalEgresos,setTotalEgresos] = useState(0)
  const [lugaresOcupados, setLugaresOcupados] = useState(0);
  const [lugaresLibres, setLugaresLibres] = useState(0);
 
  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3000/usuarios'), //consulta a los ingresos 
      fetch('http://localhost:3000/egresos').then(response => response.json()) //consulta a la tabla egresos
    ])
      .then(([usuariosResponse, egresosData]) => {
        const ingresosData = usuariosResponse.data;
  
        //Verifical el rol de cada ingreso para la grafica personas por vehiculo 

        const conteoValores = ingresosData.reduce((acc, tablaIngresos) => {
          if (tablaIngresos.tipo_vehiculo === 'Personal') {
            acc[tablaIngresos.tipo_vehiculo] = (acc[tablaIngresos.tipo_vehiculo] || 0) + 1;
          } else if (tablaIngresos.tipo_vehiculo === 'Mediano') {
            acc[tablaIngresos.tipo_vehiculo] = (acc[tablaIngresos.tipo_vehiculo] || 0) + 2;
          } else {
            acc[tablaIngresos.tipo_vehiculo] = (acc[tablaIngresos.tipo_vehiculo] || 0) + 4;
          }
          return acc;
        }, {});
  
        // Crear un conjunto de todos los roles presentes en ingresosData
        const rolesEnIngresos = new Set(ingresosData.map(tablaIngresos => tablaIngresos.rol_vehiculo));
  
        // Inicializar el conteoRol con 0 para todos los roles en ingresosData
        const conteoRol = Array.from(rolesEnIngresos).reduce((acc, rol) => {
          acc[rol] = 0;
          return acc;
        }, {});
  
        // Contar cuántas veces cada rol está presente en ingresosData
        ingresosData.forEach(tablaIngresos => {
          const rolActual = tablaIngresos.rol_vehiculo;
          conteoRol[rolActual] += 1;
        });
  
        // Restar cuántas veces cada rol está presente en egresosData
        egresosData.forEach(tablaEgresos => {
          const rolActual = tablaEgresos.rol_vehiculo;
          conteoRol[rolActual] -= 1;
        });
  
        const totalIngresos = ingresosData.length;
        const totalEgresos = egresosData.length;
        setTotalIngresos(totalIngresos);
        setTotalEgresos(totalEgresos);
  
        const lugaresOcupados = totalIngresos - totalEgresos;
        const lugaresLibres = 200 - lugaresOcupados;
        setLugaresOcupados(lugaresOcupados);
        setLugaresLibres(lugaresLibres);
  
        setCargandoDatos(false); // Marcar como completado la carga de datos
  
        setIngresos(ingresosData);
        setTablaEgresos(egresosData);
        setConteo(conteoValores);
        setConteoRol(conteoRol);
      })
      .catch(errors => {
        console.error('Error en alguna de las solicitudes:', errors);
        setCargandoDatos(false); // Marcar como completado
      });
  }, [fechaInicial, fechaFinal]);
      
  
 

  const opcionesGrafica = {
    labels: ['Lugares Ocupados', 'Lugares Libres'],
  };

  const seriesGrafica = [lugaresOcupados, lugaresLibres];
  const noMostrarBanner = () => {
    mostrarBanner(false);
  }

  const pestana = () => {

  };

  const opcionesGraficaLineas = {
    // Configuración de opciones de la gráfica de líneas
  
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
        },
      },
    },
  };

  const seriesGraficaLineas = [
    {
      name: 'Ingresos',
      data: tablaIngresos.map(ingreso => ({ x: new Date(ingreso.fecha).getTime(), y: 1 })),
    },
    {
      name: 'Egresos',
      data: tablaEgresos.map(egreso => ({ x: new Date(egreso.fecha).getTime(), y: -1 })),
    },
  ];


  

return (


    
  <div>




    {mostrarBanner && (
      <div className="banner">
          <p>¡Bienvenido! A Centinela</p>
          <button onClick={pestana}>Ir a otra pestaña</button>
          <span className="cerrar" onClick={noMostrarBanner}>&times;</span>
        </div>
      )}

  <div className="container" style={{ marginTop: mostrarBanner ? '60px' : '20px' }}>
  <div className="container">



    <div className='graph-container-right '>
      <h2>Estado de Lugares</h2>
      <Chart
        options={opcionesGrafica}
        series={seriesGrafica}
        type="donut"
        width="300"
      />
    </div>



      <div className="graph-container">
      <h2>Personas por vehículo</h2>
      <div className='roles'>
        <Chart
          options={{
            labels: Object.keys(conteo),
          }}
          series={Object.values(conteo)}
          type="donut"
          width="300"
        />
      </div>
    </div>

    <div className="graph-container-left">
      <h2>Vehículo por rol</h2>
      <div>
        <Chart
          options={{
            labels: Object.keys(conteoRoles),
            colors: ['#000000', '#FF0000','#FFE433', '#5733FF'],
          }}
          series={Object.values(conteoRoles)}
          type="donut"
          width="300"
        />
      </div>
    </div>
  </div>
  </div>

  <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
  <div className='ingreso' style={{ width: '55%', marginTop: '20px' }}>
  <h1 >Ingresos</h1>
  
  <table className='ingreso'>
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Tipo Vehiculo</th>
        <th>Rol vehiculo</th>
        
      </tr>
    </thead>
    <tbody>
      {tablaIngresos.map(ingreso => (
        <tr key={ingreso.id}>
          <td>{ingreso.id}</td>
          <td>{ingreso.fecha}</td>
          <td>{ingreso.hora}</td>
          <td>{ingreso.tipo_vehiculo}</td>
          <td>{ingreso.rol_vehiculo}</td>
        </tr>
      ))}
    </tbody>
  </table>


  </div>
  
 
  <div className='egresos' style={{ width: '55%', marginTop: '20px' }}>
  <h1 >Egresos</h1>
  <table className='egresos'>
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Tipo</th>
        <th>Rol</th>
      </tr>
    </thead>
    <tbody>
      {tablaEgresos.map(egreso => (
        <tr key={egreso.id}>
          <td>{egreso.id}</td>
          <td>{egreso.fecha}</td>
          <td>{egreso.hora}</td>
          <td>{egreso.tipo_vehiculo}</td>
          <td>{egreso.rol_vehiculo}</td>
        </tr>
      ))}
    </tbody>
  </table>

  </div> 






  </div>

  <div>
   
    <div className="date-picker-container">
        <label>Fecha Inicial:</label>
        <DatePicker selected={fechaInicial} onChange={date => setFechaInicial(date)} />
        <label>Fecha Final:</label>
        <DatePicker selected={fechaFinal} onChange={date => setFechaFinal(date)} />
      </div>

      {/* Agrega la gráfica de líneas */}
      <div className="line-chart-container">
        <Chart
          options={opcionesGraficaLineas}
          series={seriesGraficaLineas}
          type="line"
          width="100%"
        />
      </div>

  </div>
          
   
    </div>
  );
}

export default App;
