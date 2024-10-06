import React, { useEffect, useState } from "react";
import Header from "./shared/Header";
import Sidebar from "./shared/SideBar";

const Home = () => {
  const [boards, setBoards] = useState([]); // Lista de todos los tableros
  const [selectedBoard, setSelectedBoard] = useState(null); // Tablero seleccionado

  // Obtener tableros del usuario
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/boards", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        setBoards(data);
        setSelectedBoard(data[0] || null); // Selecciona el primer tablero por defecto si existe
      } catch (error) {
        console.error("Error al obtener los tableros:", error);
      }
    };

    fetchBoards();
  }, []);

  // Maneja la creación de un nuevo tablero
  const handleAddBoard = async (title) => {
    try {
      const response = await fetch("http://localhost:5000/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title }),
      });

      const newBoard = await response.json();
      setBoards((prevBoards) => [...prevBoards, newBoard]); // Actualiza la lista de tableros
    } catch (error) {
      console.error("Error al crear el tablero:", error);
    }
  };

  return (
    <div className="h-screen bg-neutral-100 flex flex-col">
      {/* Pasamos la función handleAddBoard a Header */}
      <Header onAddBoard={handleAddBoard} /> 
      <div className="flex flex-1">
        {/* Pasamos el estado de tableros y setSelectedBoard a Sidebar */}
        <Sidebar 
          boards={boards} 
          setBoards={setBoards} 
          setSelectedBoard={setSelectedBoard} 
          selectedBoard={selectedBoard} // Pasamos el tablero seleccionado actual
        />
        <div className="flex-1 p-4">
          {selectedBoard ? (
            <>
              <h2>{selectedBoard.title}</h2>
              <p>Contenido del tablero: {selectedBoard.title}</p>
            </>
          ) : (
            <p>No hay tableros disponibles. Crea un nuevo tablero para empezar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;