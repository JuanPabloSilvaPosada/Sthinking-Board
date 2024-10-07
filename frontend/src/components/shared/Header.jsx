import React, { useState } from 'react';
import Button from './Button';
import PopUp from './PopUp';

const Header = ({ onAddBoard }) => { // Recibe onAddBoard como prop
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState(""); // Estado para el título del nuevo tablero

  const handleOpenPopUp = () => {
    setIsPopUpOpen(true);
    setNewBoardTitle(""); // Reiniciar el título al abrir el pop-up
  };

  const handleClosePopUp = () => {
    setIsPopUpOpen(false);
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    // Llama a la función onAddBoard para crear el tablero y actualizar el estado en Home
    await onAddBoard(newBoardTitle);
    handleClosePopUp(); // Cierra el pop-up
  };

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 bg-neutral-200 text-black shadow-md">
        <div className="flex justify-center items-center gap-2">
          <img src='logo.svg' alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold">Sthinking Board</h1>
        </div>
        <Button 
          text="Crear Tablero" 
          onClick={handleOpenPopUp} 
          backgroundColor="bg-slate-900"
          textColor="text-white"
          hoverColor="bg-slate-700"
          className="px-4 py-2 rounded"
          fontBold="font-bold"
        />
      </header>

      {isPopUpOpen && (
        <PopUp
          isOpen={isPopUpOpen}
          onClose={handleClosePopUp}
          onSubmit={handleCreateBoard}
          title="Crear Columna"
        >
          <input
            type="text"
            value={newBoardTitle} // Usa el estado para el valor
            onChange={(e) => setNewBoardTitle(e.target.value)} // Maneja el cambio de valor
            required
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre del nuevo tablero"
          />
        </PopUp>
      )}
    </>
  );
};

export default Header;