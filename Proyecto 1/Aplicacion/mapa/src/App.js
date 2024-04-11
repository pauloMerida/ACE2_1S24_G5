import React, { useState } from 'react';
import './App.css'; // Importa tu archivo CSS con estilos personalizados
import Heatmap from './Heatmap';

function App() {
  const [selectedOption, setSelectedOption] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = () => {
    // Aquí puedes manejar la lógica cuando se presiona el botón "Enviar"
    console.log(`Fecha de inicio: ${startDate}, Fecha de final: ${endDate}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mapa de Calor Habitación No. {selectedOption && `${selectedOption}`}</h1>
        <div className="options-container">
          <select className="custom-select" value={selectedOption} onChange={handleChange}>
            <option value="">Selecciona una opción</option>
            <option value="1">Habitación 1</option>
            <option value="2">Habitación 2</option>
            <option value="3">Habitación 3</option>
            <option value="4">Habitación 4</option>
            <option value="5">Habitación 5</option>
          </select>
        </div>

        <div className="date-container">
          <label htmlFor="startDate">Fecha de inicio:</label>
          <input id="startDate" type="date" value={startDate} onChange={handleStartDateChange} />
          
          <label htmlFor="endDate">Fecha final:</label>
          <input id="endDate" type="date" value={endDate} onChange={handleEndDateChange} />

          <button onClick={handleSubmit} className="submit-button">Enviar</button>
        </div>

        <div className="heatmap-container">
          <Heatmap />
        </div>
      </header>
    </div>
  );
}

export default App;

