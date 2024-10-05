import React, { useEffect, useState } from "react";
import Header from "./shared/Header";
import Sidebar from "./shared/SideBar";

const Home = () => {
  const [boards, setBoards] = useState([]);

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
      } catch (error) {
        console.error("Error al obtener los tableros:", error);
      }
    };

    fetchBoards();
  }, []);

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
      <Header onAddBoard={handleAddBoard} /> {/* Pasa la función a Header */}
      <div className="flex flex-1">
        <Sidebar boards={boards} setBoards={setBoards} />{" "}
        {/* Pasa setBoards a Sidebar */}
        <div className="flex-1 p-4">
          <h2>Bienvenido a tu tablero</h2>
          <p>Esta es la vista principal donde aparecerán los tableros.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;