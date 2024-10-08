import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";

const Sidebar = ({ boards, setBoards, setSelectedBoard }) => {
  const navigate = useNavigate();
  const [hoveredBoard, setHoveredBoard] = useState(null); // Estado para rastrear el tablero sobre el que está el mouse
  const [isEditing, setIsEditing] = useState(null); // Almacena el ID del tablero que está en modo edición
  const [newTitle, setNewTitle] = useState(""); // Título para edición

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Manejar edición de tablero
  const handleEditBoard = async (board, newTitle) => {
    try {
      // Primero, obtén la lista de tableros existentes
      const response = await fetch("http://localhost:5000/api/boards", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const boards = await response.json();

      // Verifica si el nuevo título ya existe (excluyendo el tablero que se está editando)
      const boardExists = boards.some(
        (b) => b.title === newTitle && b.board_id !== board.board_id
      );

      if (boardExists) {
        // Maneja el error: el tablero ya existe
        alert("El tablero ya existe. Por favor, elige otro nombre.");
        return; // Salir de la función si el tablero ya existe
      }

      // Si el nuevo título no existe, procede a editar el tablero
      const editResponse = await fetch(
        `http://localhost:5000/api/boards/${board.board_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title: newTitle || board.title }),
        }
      );

      if (!editResponse.ok) {
        throw new Error("Error al editar el tablero");
      }

      const updatedBoard = await editResponse.json();
      setBoards((prevBoards) =>
        prevBoards.map((b) =>
          b.board_id === updatedBoard.board_id ? updatedBoard : b
        )
      );

      setIsEditing(null); // Finaliza el modo edición
    } catch (error) {
      console.error("Error al editar el tablero:", error);
    }
  };

  // Manejar eliminación de tablero
  const handleDeleteBoard = async (boardId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el tablero");
      }

      setBoards((prevBoards) => {
        const newBoards = prevBoards.filter(
          (board) => board.board_id !== boardId
        );
        // Asegúrate de que siempre haya al menos un tablero
        if (newBoards.length === 0) {
          return [{ board_id: "1", title: "Mi SthinkingBoard" }];
        }
        return newBoards;
      });
    } catch (error) {
      console.error("Error al eliminar el tablero:", error);
    }
  };

  return (
    <div className="h-full w-64 bg-neutral-300 text-black flex flex-col justify-between min-w-60">
      <div>
        <h2 className="text-xl font-semibold p-4 border-b border-gray-400">
          Mis Tableros
        </h2>
        <ul className="p-2 space-y-2">
          {boards.map((board) => (
            <li
              key={board.board_id}
              className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-neutral-200 relative`}
              onClick={() => setSelectedBoard(board)}
              onMouseEnter={() => setHoveredBoard(board.board_id)} // Almacena el ID del tablero en el que se hace hover
              onMouseLeave={() => setHoveredBoard(null)} // Restablece el estado al salir del hover
            >
              {/* Mostrar el input solo si el tablero está en modo edición */}
              {isEditing === board.board_id ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="border-b border-gray-500 p-1 focus:outline-none focus:border-blue-500 bg-transparent w-full"
                    placeholder={board.title}
                  />
                  <div className="w-12 flex gap-2">
                    <AiOutlineCheck
                      className="text-green-500 hover:text-green-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBoard(board);
                      }}
                    />
                    <AiOutlineDelete
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(board.board_id);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Mostrar el título del tablero normalmente */}
                  <span className="w-full">{board.title}</span>
                  {/* Mostrar los botones de editar y eliminar solo cuando el mouse esté sobre el tablero */}
                  {hoveredBoard === board.board_id && (
                    <div className="flex items-center gap-2 w-12">
                      <AiOutlineEdit
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewTitle(board.title); // Almacena el título actual
                          setIsEditing(board.board_id); // Activa el modo edición para el tablero seleccionado
                        }}
                      />
                      <AiOutlineDelete
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBoard(board.board_id);
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col p-4 gap-2">
        <Button
          text="Configuración"
          onClick={() => navigate("/settings")}
          backgroundColor="bg-slate-900"
          textColor="text-white"
          hoverColor="bg-slate-700"
          className="w-full px-4 py-2 rounded"
        />
        <Button
          text="Cerrar Sesión"
          onClick={handleLogout}
          backgroundColor="bg-neutral-900"
          textColor="text-white"
          className="w-full hover:bg-red-600"
        />
      </div>
    </div>
  );
};

export default Sidebar;
