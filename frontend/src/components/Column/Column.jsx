import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineCheck } from "react-icons/ai";

const Column = ({ title, columnDate, id, onDelete, onEdit }) => {
  // Estado para manejar el modo de edición y el nuevo título de la columna
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  // Función para manejar el guardado del nuevo título
  const handleSave = () => {
    onEdit(id, newTitle); // Llama a la función de edición con el nuevo título
    setIsEditing(false); // Cierra el modo de edición
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-min max-w-64 min-w-64 w-full">
      {/* Encabezado de la columna */}
      <div className="flex justify-between items-center gap-2">
        {isEditing ? (
          // Modo de edición: mostrar un input para cambiar el nombre de la columna
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border border-gray-300 rounded-md p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          // Modo normal: mostrar el nombre de la columna
          <h3 className="font-bold text-lg">{title}</h3>
        )}

        {/* Botones para editar, eliminar o guardar cambios */}
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-700"
            >
              <AiOutlineCheck size={20} /> {/* Icono de guardado */}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              <AiOutlineEdit size={20} /> {/* Icono de edición */}
            </button>
          )}

          {/* Botón de eliminar columna */}
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700"
          >
            <AiOutlineDelete size={20} />
          </button>
        </div>
      </div>

      {/* Aquí se podrían agregar las tarjetas/tareas */}
      <div className="mt-4">
        {/* Placeholder para tareas */}
        <p className="text-center text-gray-400">Sin tareas aún...</p>
      </div>
      <div className="flex flex-col gap-2">
        {/* Botón para añadir tarea (opcional) */}
        <button className="mt-4 w-full p-2 bg-neutral-200 text-black rounded hover:bg-blue-600 hover:text-white">
            + Añadir tarea
        </button>
        {/* Fecha de creación (opcional) */}
        <p className="text-sm text-gray-500 font-light text-end">
            Creado el: {new Date(columnDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Column;