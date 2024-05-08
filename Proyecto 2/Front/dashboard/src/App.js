import React, { useState, useEffect } from 'react';

function App() {
  const [estado, setEstado] = useState('');

  useEffect(() => {
    // Función para obtener el estado actual desde la API
    const obtenerEstado = async () => {
      try {
        const response = await fetch('http://localhost:2000/login'); // Endpoint de la API para obtener el estado
        if (!response.ok) {
          throw new Error('No se pudo obtener el estado');
        }
        const data = await response.json();
        setEstado(data.estado);
      } catch (error) {
        console.error('Error al obtener el estado:', error);
      }
    };

    // Llamar a la función para obtener el estado inicialmente
    obtenerEstado();

    // Establecer un intervalo para obtener el estado cada 10 segundos
    const interval = setInterval(() => {
      obtenerEstado();
    }, 10000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Estado Actual: {estado}</h1>
    </div>
  );
}

export default App;
