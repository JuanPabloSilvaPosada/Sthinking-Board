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
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg p-4 w-6/12 h-4/5">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="rounded-md p-1 w-full font-semibold focus:outline focus:outline-blue-500 focus:bg-gray-50 text-lg"
              />
              <div className="border-t border-gray-200 shadow-sm"></div>
              <h2 className="text-sm font-light text-gray-600">
                en lista:{" "}
                <span className="font-semibold text-gray-800">
                  {columnName}
                </span>
              </h2>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-gray-800">
                  Descripción
                </h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Añade una descripción más detallada..."
                  className="border border-gray-300 rounded-md p-2 w-full h-24"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-gray-800">
                  Actividad
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-full h-8 max-w-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-xl">
                    J
                  </div>
                  <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
              </div>
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
