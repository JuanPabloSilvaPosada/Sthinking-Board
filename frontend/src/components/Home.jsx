import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Header from "./shared/Header";
import Sidebar from "./shared/SideBar";
import Column from "./Column/Column";
import PopUp from "./shared/PopUp";

const Home = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [boards, setBoards] = useState([]); // Lista de todos los tableros
  const [selectedBoard, setSelectedBoard] = useState(null); // Tablero seleccionado
  const [cols, setColums] = useState([]); // Columnas segun el tablero
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleOpenPopUp = () => {
    setIsPopUpOpen(true);
    setNewColumnTitle(""); // Reiniciar el título al abrir el pop-up
  };

  const handleClosePopUp = () => {
    setIsPopUpOpen(false);
  };

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

  useEffect(() => {
    const fetchColumns = async () => {
      if (!selectedBoard) return;
      try {
        const response = await fetch(
          `http://localhost:5000/api/boards/${selectedBoard.board_id}/columns`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        setColums(data);
      } catch (error) {
        console.error("Error al obtener las columnas:", error);
      }
    };

    fetchColumns();
  }, [selectedBoard]);

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

  // Manejo de creacion de una nueva columna dentro de un tablero
  const handleAddColumn = async (title, selectedBoard) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/boards/${selectedBoard.board_id}/columns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title }),
        }
      );
      if (!response.ok) {
        throw Error("Error al crear la columna");
      }
      const newColumn = await response.json();
      setColums((prevColumns) => [...prevColumns, newColumn]);
    } catch (error) {
      console.error("Error al crear la columna", error);
    }
  };

  return (
    <div className="h-screen bg-neutral-100 flex flex-col">
      {/* Pasamos la función handleAddBoard a Header */}
      <Header onAddBoard={handleAddBoard} />
      <div className="flex w-full h-full">
        {/* Pasamos el estado de tableros y setSelectedBoard a Sidebar */}
        <Sidebar
          boards={boards}
          setBoards={setBoards}
          setSelectedBoard={setSelectedBoard}
          selectedBoard={selectedBoard} // Pasamos el tablero seleccionado actual
        />
        <div className="gap-4 flex-col flex w-full relative">
          <div className="p-4 shadow-xl bg-neutral-700 text-white border-b border-neutral-700">
            <h2 className="font-bold text-xl">{selectedBoard?.title}</h2>
          </div>
          {/* Aquí se mapean las columnas */}
          <div className="columns-container flex gap-6 py-2 px-4 overflow-x-scroll w-full h-full absolute">
            {cols.map((col) => (
              <Column
                key={col.column_id} // Asigna la key a cada columna
                title={col.title} // Pasa el título de la columna como prop
                columnDate={col.created_at} // Pasa el ID de la columna como prop
              />
            ))}
            <button
              className="w-full p-4 flex items-center justify-start gap-1 hover:text-neutral-600 bg-neutral-200 h-min max-w-64 min-w-64 w-full rounded-lg"
              onClick={handleOpenPopUp}
            >
              <AiOutlinePlus className="text-inherit" />
              Añadir columna
            </button>
            {isPopUpOpen && (
              <PopUp
                isOpen={isPopUpOpen}
                onClose={handleClosePopUp}
                onSubmit={() => handleAddColumn(newColumnTitle, selectedBoard)}
                title="Crear Columna"
              >
                <input
                  type="text"
                  value={newColumnTitle} // Usa el estado para el valor
                  onChange={(e) => setNewColumnTitle(e.target.value)} // Maneja el cambio de valor
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre del nuevo columna"
                />
              </PopUp>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
