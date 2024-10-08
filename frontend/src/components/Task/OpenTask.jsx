import React, { useState, useEffect } from "react";

const OpenTask = ({
  taskTitle,
  columnName,
  taskId,
  onEdit,
  onClose,
  existingDescription = "",
}) => {
  const [newTitle, setNewTitle] = useState(taskTitle);
  const [description, setDescription] = useState(existingDescription);
  const [isOpen, setIsOpen] = useState(true); // Estado para manejar la apertura del pop-up

  useEffect(() => {
    setDescription(existingDescription);
  }, [existingDescription]);

  const handleSave = () => {
    onEdit(taskId, newTitle, description);
    setIsOpen(false); // Cierra el pop-up al guardar
    onClose(); // Llama a la función de cierre proporcionada
  };

  // Función para manejar el cierre del pop-up al hacer clic fuera
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("popup-overlay")) {
      setIsOpen(false);
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleOutsideClick}
        >
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg p-4 w-96">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Editar Tarea</h2>
              <h4 className="text-md">Columna: {columnName}</h4>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Añade una descripción (opcional)"
                className="border border-gray-300 rounded-md p-1 w-full h-24"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
                className="text-red-500 hover:text-red-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OpenTask;
