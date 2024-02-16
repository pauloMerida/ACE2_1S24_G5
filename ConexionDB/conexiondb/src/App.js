
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import './style.css'; // Importa el archivo CSS de estilos

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
  

  useEffect(() => {
    axios.get('http://localhost:3000/usuarios')
      .then(response => {
        const ingresosData = response.data;
        //const { usuarios, otraTabla } = response.data;
        //setIngresos(tablaIngresos);
        //setTablaEgresos(tablaEgresos)
        
        
        //alert(200-(totalIngresos-totalEgresos))

        //setOtraTabla(otraTabla);
        // Contar cuántos "Sí" y "No" hay
        const conteoValores = ingresosData.reduce((acc, tablaIngresos) => {
          //acc[tablaIngresos.tipo_vehiculo] = (acc[tablaIngresos.tipo_vehiculo] || 0) + 1;
          if  (tablaIngresos.tipo_vehiculo === 'Personal'){
            acc[tablaIngresos.tipo_vehiculo] = (acc[tablaIngresos.tipo_vehiculo] || 0) + 1

          }else if (tablaIngresos.tipo_vehiculo === 'Mediano'){
            acc[tablaIngresos.tipo_vehiculo] = (acc[tablaIngresos.tipo_vehiculo] || 0) + 2
          }else{
            acc[tablaIngresos.tipo_vehiculo] = (acc[tablaIngresos.tipo_vehiculo] || 0) + 4
          }


          return acc;
        }, {});


        const conteoRol = ingresosData.reduce((acc, tablaIngresos) => {
         // const s = acc[tablaEgresos.rol_vehiculo] = (acc[tablaEgresos.rol_vehiculo] || 0) + 1
          acc[tablaIngresos.rol_vehiculo] = (acc[tablaIngresos.rol_vehiculo] || 0) + 1 ;

          return acc;
        }, {});


        console.log('Conteo de valores:', conteoValores);



        const totalIngresos = ingresosData.length
        const totalEgresos = tablaEgresos.length
        setTotalIngresos(totalIngresos)
        setTotalEgresos(totalEgresos)

        const lugaresOcupados = totalIngresos - totalEgresos;
        const lugaresLibres = 200 - lugaresOcupados;
        setLugaresOcupados(lugaresOcupados)
        setLugaresLibres(lugaresLibres)
        setCargandoDatos(false); // Marcar como completado la carga de datos

        //alert(totalIngresos)
        //alert(totalEgresos)
        

        setIngresos(ingresosData);
        
       
        setConteo(conteoValores);
        setConteoRol(conteoRol)
        
      })
      .catch(error => {
        console.error('Error al obtener usuarios:', error);
        setCargandoDatos(false); // Marcar como completado
      });

      fetch('http://localhost:3000/egresos')
      .then(response => response.json())
      .then(data => setTablaEgresos(data));
      
      

      



  }, []);


  
 

  const opcionesGrafica = {
    labels: ['Lugares Ocupados', 'Lugares Libres'],
  };

  const seriesGrafica = [lugaresOcupados, lugaresLibres];
  const noMostrarBanner = () => {
    mostrarBanner(false);
  }

  const pestana = () => {

  };

  

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
          
   
    </div>
  );
}

export default App;
