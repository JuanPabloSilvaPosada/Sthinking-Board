// src/components/shared/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Verifica si hay un token en el almacenamiento

  // Función para manejar la redirección
  const handleRedirect = () => {
    if (token) {
      navigate("/home"); // Redirige a '/home' si hay un token
    } else {
      navigate(-1); // Redirige a la última página visitada
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página No Encontrada</h2>
      <p className="text-lg mb-4">
        Lo sentimos, la página que buscas no existe.
      </p>
      <button
        onClick={handleRedirect}
        className="bg-neutral-900 text-white rounded-md px-4 py-2 hover:bg-neutral-600 transition"
      >
        {token ? "Volver al Inicio" : "Volver"}
      </button>
    </div>
  );
};

export default NotFound;