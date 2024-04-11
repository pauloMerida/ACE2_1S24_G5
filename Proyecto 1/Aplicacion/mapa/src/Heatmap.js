import React, { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

const Heatmap = () => {
  const containerRef = useRef();

  useEffect(() => {
    const heatmapData = [];
    for (let i = 0; i < 1000; i++) {
      heatmapData.push({
        x: Math.floor(Math.random() * 800), // Coordenada x aleatoria dentro del contenedor
        y: Math.floor(Math.random() * 600), // Coordenada y aleatoria dentro del contenedor
        value: Math.random() // Valor de intensidad del calor
      });
    }

    const heatmapInstance = h337.create({
      container: containerRef.current,
      radius: 20
    });

    heatmapInstance.setData({
      max: 1, // Valor máximo de intensidad del calor
      data: heatmapData
    });
  }, []);

  return <div ref={containerRef} style={{ width: '800px', height: '600px' }} />;
};

export default Heatmap;


