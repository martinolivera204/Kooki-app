import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import DeTemporada from './DeTemporada';
import AhorroExpress from './AhorroExpress';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/detemporada" element={<DeTemporada />} />
        <Route path="/ahorroexpress" element={<AhorroExpress />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
