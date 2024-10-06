import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import PopUp from "./PopUp";
import { BsThreeDots } from "react-icons/bs";

const Sidebar = ({ boards, setBoards, selectedBoard, setSelectedBoard }) => {
  const navigate = useNavigate();
  const [actionType, setActionType] = useState(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  // Ref para el menú de acciones
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleMenuClick = (board, type) => {
    setSelectedBoard(board);
    setActionType(type);
    setIsPopUpOpen(true);
    if (type === "edit") {
      setNewTitle(board.title);
    }
  };

  const toggleMenu = (boardId) => {
    setActiveMenu((prev) => (prev === boardId ? null : boardId));
  };

  const handleClosePopUp = () => {
    setIsPopUpOpen(false);
    setActionType(null);
    setNewTitle("");
  };

  // Manejo de clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null); // Cierra el menú si se hace clic fuera
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditBoard = async (newTitle) => {
    if (!selectedBoard) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/boards/${selectedBoard.board_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title: newTitle }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al editar el tablero");
      }

      const updatedBoard = await response.json();
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.board_id === updatedBoard.board_id ? updatedBoard : board
        )
      );

      handleClosePopUp();
    } catch (error) {
      console.error("Error al editar el tablero:", error);
    }
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoard) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/boards/${selectedBoard.board_id}`,
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

      setBoards((prevBoards) =>
        prevBoards.filter((board) => board.board_id !== selectedBoard.board_id)
      );

      handleClosePopUp();
    } catch (error) {
      console.error("Error al eliminar el tablero:", error);
    }
  };

  return (
    <div className="h-full w-64 bg-neutral-300 text-black flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold p-4 border-b border-gray-400">
          Mis Tableros
        </h2>
        <ul className="p-2 space-y-2">
          {boards.map((board) => (
            <li
              key={board.board_id}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                activeMenu === board.board_id ? "bg-neutral-200" : ""
              }`}
              onClick={() => setSelectedBoard(board)}
            >
              <span>{board.title}</span>
              <div className="relative w-6 h-4">
                <button
                  className="menu-button flex items-center justify-center rounded hover:bg-neutral-400 w-7 h-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(board.board_id);
                  }}
                >
                  <BsThreeDots />
                </button>
                {activeMenu === board.board_id && (
                  <div
                    ref={menuRef} // Asigna el ref al contenedor del menú
                    className="menu-list absolute left-0 top-1/2 bg-white shadow-lg rounded-md transform -translate-y-1/2 translate-x-10 p-2"
                  >
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-r-8 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                    <ul>
                      <li
                        className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                        onClick={() => handleMenuClick(board, "edit")}
                      >
                        Editar
                      </li>
                      <li
                        className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                        onClick={() => handleMenuClick(board, "delete")}
                      >
                        Eliminar
                      </li>
                    </ul>
                  </div>
                )}
              </div>
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

      {isPopUpOpen && (
        <PopUp
          isOpen={isPopUpOpen}
          onClose={handleClosePopUp}
          onSubmit={
            actionType === "edit"
              ? (e) => {
                  e.preventDefault();
                  handleEditBoard(newTitle);
                }
              : handleDeleteBoard
          }
          title={
            actionType === "edit"
              ? `Cambiarás el nombre ${selectedBoard?.title} a:`
              : `¿Seguro que deseas eliminar el tablero ${selectedBoard?.title}?`
          }
        >
          {actionType === "edit" ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nuevo nombre del tablero"
            />
          ) : (
            <p>Esta acción no se puede deshacer.</p>
          )}
        </PopUp>
      )}
    </div>
  );
};

export default Sidebar;