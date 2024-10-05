import React, { useState } from "react";
import InputField from "../shared/InputField";
import Button from "../shared/Button";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  // Funcionalidad backend
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail: identifier, password }), // Cambiar identifier a usernameOrEmail
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error); // Actualizar el mensaje de error
      } else {
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Construcción del FrontEnd
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <img src='logo.svg' alt="Logo" className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Iniciar sesión</h1>
        <p className="text-center text-gray-500 mb-6">
          Ingresa a tu cuenta de Sthinking Board
        </p>
        <form onSubmit={handleLogin}>
          {" "}
          {/* Cambié aquí */}
          <InputField
            label="Usuario o Correo electrónico"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Ingresa tu usuario o correo electrónico"
          />
          <InputField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
          {error && (
            <div className="mb-4 text-red-500 text-sm font-semibold text-center">
              {error}
            </div>
          )}
          <Button
            text="Iniciar sesión"
            type="submit"
            backgroundColor="bg-black"
            fontBold="font-semibold"
            textColor="text-white"
            hoverColor="hover:bg-gray-800"
            className="rounded w-full"
          />
        </form>
        <p className="mt-4 text-center">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-500 hover:text-blue-700">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
