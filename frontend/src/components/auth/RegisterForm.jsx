import React, { useState } from "react";
import InputField from "../shared/InputField";
import Button from "../shared/Button";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  // Funcionalidad backend
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, verifyPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    // Construcción del frontEnd
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <img src='logo.svg' alt="Logo" className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Crear cuenta</h1>
        <p className="text-center text-gray-500 mb-6">
          Regístrate para usar Sthinking Board
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <InputField
            label="Nombre completo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu nombre completo"
          />
          <InputField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
          />
          <InputField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
          <InputField
            label="Confirmar contraseña"
            type="password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            placeholder="********"
          />
          {error && (
            <div className="mb-4 text-red-500 text-sm font-semibold text-center">
              {error}
            </div>
          )}
          <Button
            text="Registrarse"
            type="submit"
            onClick={handleRegister}
            backgroundColor="bg-black"
            fontBold="font-semibold"
            textColor="text-white"
            hoverColor="hover:bg-gray-800"
            className="rounded w-full"
          />
          <p className="mt-4 text-center">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-blue-600">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
