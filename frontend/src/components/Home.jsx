import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Header from "./shared/Header";
import Sidebar from "./shared/SideBar";
import Column from "./Column/Column";
import PopUp from "./shared/PopUp";

const Home = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [cols, setColums] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleOpenPopUp = () => {
    setIsPopUpOpen(true);
    setNewColumnTitle("");
  };

  const handleClosePopUp = () => {
    setIsPopUpOpen(false);
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/boards", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setBoards(data);
        setSelectedBoard(data[0] || null);
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

  const handleAddBoard = async (title) => {
    try {
      // Primero, obtén la lista de tableros existentes
      const response = await fetch("http://localhost:5000/api/boards", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const boards = await response.json();

      // Verifica si el título ya existe
      const boardExists = boards.some((board) => board.title === title);

      if (boardExists) {
        // Maneja el error: el tablero ya existe
        alert("El tablero ya existe. Por favor, elige otro nombre.");
        return; // Salir de la función si el tablero ya existe
      }

      // Si el tablero no existe, procede a crearlo
      const createResponse = await fetch("http://localhost:5000/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title }),
      });

      const newBoard = await createResponse.json();
      setBoards((prevBoards) => [...prevBoards, newBoard]);
    } catch (error) {
      console.error("Error al crear el tablero:", error);
    }
  };

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

  const handleEditColumn = async (columnId, newTitle) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/columns/${columnId}`,
        {
          method: "PUT", // Usa el método PUT para actualizar
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title: newTitle }), // Enviar el nuevo título
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la columna");
      }

      // Actualiza el título de la columna en el estado
      setColums((prevColumns) =>
        prevColumns.map((col) =>
          col.column_id === columnId ? { ...col, title: newTitle } : col
        )
      );
    } catch (error) {
      console.error("Error al actualizar la columna:", error);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/columns/${columnId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar la columna");
      }

      // Filtrar la columna eliminada del estado
      setColums((prevColumns) =>
        prevColumns.filter((col) => col.column_id !== columnId)
      );
    } catch (error) {
      console.error("Error al eliminar la columna:", error);
    }
  };

  return (
    <div className="h-screen bg-neutral-100 flex flex-col">
      <Header onAddBoard={handleAddBoard} />
      <div className="flex w-full h-full">
        <Sidebar
          boards={boards}
          setBoards={setBoards}
          setSelectedBoard={setSelectedBoard}
          selectedBoard={selectedBoard}
        />
        <div className="gap-4 flex-col flex w-full relative">
          <div className="p-4 shadow-xl bg-neutral-700 text-white border-b border-neutral-700">
            <h2 className="font-bold text-xl">{selectedBoard?.title}</h2>
          </div>
          <div className="columns-container flex gap-6 p-4 overflow-x-scroll w-full h-full absolute">
            {cols.map((col) => (
              <Column
                key={col.column_id}
                title={col.title}
                columnDate={col.created_at}
                id={col.column_id}
                onEdit={handleEditColumn}
                onDelete={handleDeleteColumn}
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
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
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